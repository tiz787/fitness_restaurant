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
  // Controla visibilidad del formulario modal de plato (crear o editar).
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  // Controla si se esta editando un plato existente, guarda su ID.
  const [editingDishId, setEditingDishId] = useState<string | null>(null)
  // Controla el mensaje de exito despues de crear/editar un plato.
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  // Controla los valores del formulario de alta o edicion.
  const [newDishFormValues, setNewDishFormValues] = useState<NewDishFormValues>(
    initialNewDishFormValues,
  )

  // Filtra platos segun busqueda y categoria seleccionada.
  const filteredDishes = useMemo(() => {
    // Normaliza busqueda para comparacion case-insensitive.
    const normalizedSearch = searchTerm.trim().toLowerCase()

    // Retorna solo platos activos que cumplen ambos filtros.
    return dishes.filter((dish) => {
      // Ignora platos eliminados (soft delete).
      if (dish.isDeleted) return false

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

  // Procesa el alta o edicion de un plato en memoria local.
  const handleSaveDish = (event: FormEvent<HTMLFormElement>): void => {
    // Evita recarga de pagina en submit.
    event.preventDefault()

    // Evita guardar si faltan campos clave basicos.
    if (newDishFormValues.name.trim().length === 0 || newDishFormValues.emoji.trim().length === 0) {
      return
    }

    if (editingDishId) {
      // Actualiza plato existente.
      setDishes((prevDishes) =>
        prevDishes.map((dish) =>
          dish.id === editingDishId
            ? {
                ...dish,
                name: newDishFormValues.name.trim(),
                description: newDishFormValues.description.trim(),
                emoji: newDishFormValues.emoji.trim(),
                category: newDishFormValues.category,
                price: parseNumber(newDishFormValues.price),
                calories: parseNumber(newDishFormValues.calories),
                protein: parseNumber(newDishFormValues.protein),
                carbs: parseNumber(newDishFormValues.carbs),
              }
            : dish,
        ),
      )
      setSuccessMessage('Plato actualizado correctamente.')
    } else {
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
      setSuccessMessage('Plato creado correctamente.')
    }

    // Limpia mensaje de exito despues de 3 segundos y cierra modal
    setTimeout(() => {
      setSuccessMessage(null)
      setIsModalOpen(false)
    }, 3000)
    
    // Reinicia formulario para el futuro
    setNewDishFormValues(initialNewDishFormValues)
    setEditingDishId(null)
    setActiveCategory('Todos')
  }

  // Prepara el modal para editar un plato existente.
  const handleEditDishClick = (dish: MenuDish): void => {
    setNewDishFormValues({
      name: dish.name,
      description: dish.description,
      emoji: dish.emoji,
      category: dish.category,
      price: dish.price.toString(),
      calories: dish.calories.toString(),
      protein: dish.protein.toString(),
      carbs: dish.carbs.toString(),
    })
    setEditingDishId(dish.id)
    setSuccessMessage(null)
    setIsModalOpen(true)
  }

  // Abre el modal para nuevo plato.
  const handleOpenNewDishModal = (): void => {
    setNewDishFormValues(initialNewDishFormValues)
    setEditingDishId(null)
    setSuccessMessage(null)
    setIsModalOpen(true)
  }

  // Cierra el modal sin guardar.
  const handleCloseModal = (): void => {
    setIsModalOpen(false)
    setSuccessMessage(null)
  }

  // Elimina un plato con confirmacion basica (soft delete).
  const handleDeleteDish = (dishId: string): void => {
    // Confirmacion nativa para evitar borrados accidentales.
    const userConfirmed = window.confirm('¿Seguro que deseas eliminar este plato del menu?')
    if (userConfirmed) {
      setDishes((prev) =>
        prev.map((dish) => (dish.id === dishId ? { ...dish, isDeleted: true } : dish)),
      )
    }
  }

  // Array de platos no eliminados
  const activeDishes = dishes.filter((d) => !d.isDeleted)

  // Renderiza cabecera, filtros, formulario y cards de platos.
  return (
    <section className="menuManagementTab" aria-label="Gestion de menu">
      <header className="menuManagementTab__header">
        <h2 className="menuManagementTab__title">Gestion de menu</h2>
        <p className="menuManagementTab__subtitle">{activeDishes.length} productos en el menu</p>
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
          onClick={handleOpenNewDishModal}
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

      {isModalOpen ? (
        <div className="menuManagementTab__modalOverlay" onClick={handleCloseModal}>
          <div
            className="menuManagementTab__modalContent panelCard"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="menuManagementTab__modalHeader">
              <h3 className="menuManagementTab__formTitle">
                {editingDishId ? 'Editar plato' : 'Agregar nuevo plato'}
              </h3>
              <button
                type="button"
                className="menuManagementTab__closeModalButton"
                onClick={handleCloseModal}
                aria-label="Cerrar modal"
              >
                ✖
              </button>
            </div>

            {successMessage ? (
              <div className="menuManagementTab__successMessage">{successMessage}</div>
            ) : (
              <form className="menuManagementTab__createForm" onSubmit={handleSaveDish}>
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
                      {categories.filter(c => c !== 'Todos').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Precio
                    <input
                      type="number"
                      min="0"
                      step="0.01"
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
                    {editingDishId ? 'Guardar cambios' : 'Crear plato'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {activeDishes.length === 0 ? (
        <div className="menuManagementTab__emptyState">
          <div className="menuManagementTab__emptyIcon" aria-hidden>🍽️</div>
          <h3>¡Tu menú está vacío!</h3>
          <p>Es el momento perfecto para agregar tu primer platillo y empezar a vender.</p>
          <button
            type="button"
            className="menuManagementTab__newDishButton"
            onClick={handleOpenNewDishModal}
          >
            ➕ Crear mi primer plato
          </button>
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="menuManagementTab__emptyState">
          <div className="menuManagementTab__emptyIcon" aria-hidden>🔍</div>
          <h3>No hay resultados</h3>
          <p>No se encontraron platos que coincidan con los filtros actuales.</p>
        </div>
      ) : (
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
                  <button type="button" aria-label="Editar plato" onClick={() => handleEditDishClick(dish)}>
                    ✏️
                  </button>
                  <button type="button" aria-label="Eliminar plato" onClick={() => handleDeleteDish(dish.id)}>
                    🗑️
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
