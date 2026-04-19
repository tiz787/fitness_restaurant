// Importa utilidades de estado para filtros y alta de platos.
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
// Importa tipos para modelo de platos y categorias del menu.
import type {
  MenuDish,
  MenuDishCategory,
  MenuFilterCategory,
} from '../adminDashboard/adminDashboard.types'
// Importa estilos especificos de la pestaña de menu.
import './menuManagementTab.css'

// Define props del componente de gestion de menu.
interface MenuManagementTabProps {
  // Coleccion base de platos estaticos cargados en la vista.
  initialDishes: MenuDish[]
  // Coleccion de categorias disponibles para filtrar.
  categories: MenuFilterCategory[]
}

// Define la forma interna del formulario para crear nuevo plato.
interface NewDishFormValues {
  // Nombre del nuevo plato.
  name: string
  // Descripcion corta del plato.
  description: string
  // Emoji principal del plato (sin imagen).
  emoji: string
  // Categoria seleccionada para el nuevo plato.
  category: MenuDishCategory
  // Precio en texto para parseo controlado.
  price: string
  // Calorias en texto para parseo controlado.
  calories: string
  // Proteina en texto para parseo controlado.
  protein: string
  // Carbs en texto para parseo controlado.
  carbs: string
}

// Define estado inicial del formulario de alta rapida.
const initialNewDishFormValues: NewDishFormValues = {
  name: '',
  description: '',
  emoji: '🥗',
  category: 'Almuerzo',
  price: '',
  calories: '',
  protein: '',
  carbs: '',
}

// Convierte texto numerico a numero seguro con fallback.
const parseNumber = (value: string): number => {
  // Intenta convertir el string a numero.
  const parsedValue = Number(value)
  // Retorna cero si no es un numero valido.
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

// Renderiza la pestaña de menu con filtros y alta de platos.
export default function MenuManagementTab({ initialDishes, categories }: MenuManagementTabProps) {
  // Guarda la lista actual de platos visibles en la gestion.
  const [dishes, setDishes] = useState<MenuDish[]>(initialDishes)
  // Controla el texto de busqueda por nombre de plato.
  const [searchTerm, setSearchTerm] = useState<string>('')
  // Controla la categoria activa para el filtrado.
  const [activeCategory, setActiveCategory] = useState<MenuFilterCategory>('Todos')
  // Controla visibilidad del formulario de nuevo plato.
  const [isCreateFormVisible, setIsCreateFormVisible] = useState<boolean>(false)
  // Controla los valores del formulario de alta.
  const [newDishFormValues, setNewDishFormValues] = useState<NewDishFormValues>(
    initialNewDishFormValues,
  )

  // Filtra platos segun busqueda y categoria seleccionada.
  const filteredDishes = useMemo(() => {
    // Normaliza busqueda para comparacion case-insensitive.
    const normalizedSearch = searchTerm.trim().toLowerCase()

    // Retorna solo platos que cumplen ambos filtros activos.
    return dishes.filter((dish) => {
      // Verifica coincidencia de texto por nombre o descripcion.
      const matchBySearch =
        normalizedSearch.length === 0 ||
        dish.name.toLowerCase().includes(normalizedSearch) ||
        dish.description.toLowerCase().includes(normalizedSearch)

      // Verifica coincidencia por categoria activa.
      const matchByCategory = activeCategory === 'Todos' || dish.category === activeCategory

      // Conserva plato cuando cumple busqueda y categoria.
      return matchBySearch && matchByCategory
    })
  }, [dishes, searchTerm, activeCategory])

  // Actualiza campos de texto del formulario de alta.
  const updateFormField =
    (field: keyof NewDishFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
      // Toma el valor mas reciente del campo editado.
      const nextValue = event.target.value
      // Guarda valor nuevo manteniendo el resto de campos.
      setNewDishFormValues((previousValues) => ({
        ...previousValues,
        [field]: nextValue,
      }))
    }

  // Procesa el alta rapida de un nuevo plato en memoria local.
  const handleCreateDish = (event: FormEvent<HTMLFormElement>): void => {
    // Evita recarga de pagina en submit.
    event.preventDefault()

    // Evita crear si faltan campos clave basicos.
    if (newDishFormValues.name.trim().length === 0 || newDishFormValues.emoji.trim().length === 0) {
      return
    }

    // Construye el nuevo registro con valores convertidos.
    const nextDish: MenuDish = {
      id: `dish-${Date.now()}`,
      name: newDishFormValues.name.trim(),
      description: newDishFormValues.description.trim() || 'Plato nuevo agregado desde admin.',
      emoji: newDishFormValues.emoji.trim(),
      category: newDishFormValues.category,
      price: parseNumber(newDishFormValues.price),
      calories: parseNumber(newDishFormValues.calories),
      protein: parseNumber(newDishFormValues.protein),
      carbs: parseNumber(newDishFormValues.carbs),
      rating: 0,
      reviews: 0,
    }

    // Inserta plato nuevo al inicio para feedback inmediato.
    setDishes((previousDishes) => [nextDish, ...previousDishes])
    // Reinicia formulario para siguientes altas.
    setNewDishFormValues(initialNewDishFormValues)
    // Cierra el formulario tras completar alta local.
    setIsCreateFormVisible(false)
    // Cambia filtro a todos para ver el nuevo item sin bloqueo.
    setActiveCategory('Todos')
  }

  // Renderiza cabecera, filtros, formulario y cards de platos.
  return (
    <section className="menuManagementTab" aria-label="Gestion de menu">
      <header className="menuManagementTab__header">
        <h2 className="menuManagementTab__title">Gestion de menu</h2>
        <p className="menuManagementTab__subtitle">{dishes.length} productos en el menu</p>
      </header>

      <div className="menuManagementTab__toolbar">
        <label className="menuManagementTab__search" htmlFor="menu-search-input">
          <span aria-hidden>🔎</span>
          <input
            id="menu-search-input"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar platos..."
          />
        </label>

        <button
          type="button"
          className="menuManagementTab__newDishButton"
          onClick={() => setIsCreateFormVisible((previous) => !previous)}
        >
          ➕ Nuevo plato
        </button>
      </div>

      <div className="menuManagementTab__categories" aria-label="Filtro por categoria">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`menuManagementTab__categoryButton ${activeCategory === category ? 'is-active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {isCreateFormVisible ? (
        <form className="menuManagementTab__createForm panelCard" onSubmit={handleCreateDish}>
          <h3 className="menuManagementTab__formTitle">Agregar nuevo plato</h3>

          <div className="menuManagementTab__formGrid">
            <label>
              Nombre
              <input value={newDishFormValues.name} onChange={updateFormField('name')} required />
            </label>

            <label>
              Emoji
              <input value={newDishFormValues.emoji} onChange={updateFormField('emoji')} required />
            </label>

            <label>
              Categoria
              <select value={newDishFormValues.category} onChange={updateFormField('category')}>
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Cena">Cena</option>
                <option value="Smoothies">Smoothies</option>
                <option value="Snacks">Snacks</option>
                <option value="Suplementos">Suplementos</option>
              </select>
            </label>

            <label>
              Precio
              <input
                type="number"
                min="0"
                value={newDishFormValues.price}
                onChange={updateFormField('price')}
              />
            </label>

            <label>
              Calorias
              <input
                type="number"
                min="0"
                value={newDishFormValues.calories}
                onChange={updateFormField('calories')}
              />
            </label>

            <label>
              Proteinas
              <input
                type="number"
                min="0"
                value={newDishFormValues.protein}
                onChange={updateFormField('protein')}
              />
            </label>

            <label>
              Carbohidratos
              <input
                type="number"
                min="0"
                value={newDishFormValues.carbs}
                onChange={updateFormField('carbs')}
              />
            </label>
          </div>

          <label className="menuManagementTab__descriptionField">
            Descripcion
            <textarea
              rows={3}
              value={newDishFormValues.description}
              onChange={updateFormField('description')}
              placeholder="Descripcion corta del plato"
            />
          </label>

          <div className="menuManagementTab__formActions">
            <button type="submit" className="menuManagementTab__saveDishButton">
              Guardar plato
            </button>
          </div>
        </form>
      ) : null}

      <div className="menuManagementTab__grid" aria-label="Listado de platillos">
        {filteredDishes.map((dish) => (
          <article key={dish.id} className="menuDishCard">
            <header className="menuDishCard__header">
              <span className="menuDishCard__badge">{dish.category}</span>
              {dish.featured ? <span className="menuDishCard__featured">⭐</span> : null}
            </header>

            <div className="menuDishCard__emoji" aria-hidden>
              {dish.emoji}
            </div>

            <div className="menuDishCard__heading">
              <h3>{dish.name}</h3>
              <strong>${dish.price}</strong>
            </div>

            <p className="menuDishCard__description">{dish.description}</p>

            <div className="menuDishCard__macros">
              <div>
                <span>{dish.calories}</span>
                <small>Cal</small>
              </div>
              <div>
                <span>{dish.protein}g</span>
                <small>Prot</small>
              </div>
              <div>
                <span>{dish.carbs}g</span>
                <small>Carbs</small>
              </div>
            </div>

            <footer className="menuDishCard__footer">
              <p>⭐ {dish.rating.toFixed(1)} ({dish.reviews})</p>
              <div>
                <button type="button" aria-label="Editar plato">
                  ✏️
                </button>
                <button type="button" aria-label="Eliminar plato">
                  🗑️
                </button>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
