// Importa estado local para filtros y busqueda del menu cliente.
import { useMemo, useState, type ChangeEvent } from 'react'
// Importa tipos de categorias y ordenamiento de la vista.
import type {
  ClientDishCategory,
  ClientMenuSortOption,
  ClientMenuViewProps,
} from './clientMenuView.types'
// Importa vistas secundarias del cliente.
import ClientCartView from '../clientCartView/clientCartView'
import ClientAccountView from '../clientAccountView/clientAccountView'
import ClientCheckoutView from '../clientCheckoutView/clientCheckoutView'
import ClientOrderSuccessView from '../clientOrderSuccessView/clientOrderSuccessView'
import type { OrderSuccessInfo } from '../clientOrderSuccessView/clientOrderSuccessView.types'
import type { ClientCartItem } from '../clientCartView/clientCartView.types'
// Importa estilos dedicados de la vista cliente.
import './clientMenuView.css'

// Define la forma de un platillo en el catalogo cliente.
interface ClientDish {
  id: string
  name: string
  description: string
  price: number
  calories: number
  protein: number
  carbs: number
  rating: number
  etaMinutes: number
  category: ClientDishCategory
  featured?: boolean
  available: boolean
  emoji: string
}

// Define filtro de categoria (incluye opcion global).
type ClientCategoryFilter = 'Todos' | ClientDishCategory

// Dataset estatico de platillos para la primera version visual cliente.
const clientDishesData: ClientDish[] = [
  {
    id: 'dish-01',
    name: 'Salmon Fit Bowl',
    description: 'Filete de salmon al horno con vegetales mediterraneos y quinoa.',
    price: 34000,
    calories: 480,
    protein: 42,
    carbs: 18,
    rating: 4.9,
    etaMinutes: 20,
    category: 'Cenas',
    featured: true,
    available: true,
    emoji: '🥗',
  },
  {
    id: 'dish-02',
    name: 'Meal Prep Box',
    description: 'Caja con 5 comidas balanceadas para tu semana fitness.',
    price: 140000,
    calories: 480,
    protein: 40,
    carbs: 50,
    rating: 4.9,
    etaMinutes: 30,
    category: 'Almuerzos',
    featured: true,
    available: true,
    emoji: '🍱',
  },
  {
    id: 'dish-03',
    name: 'Power Chicken Bowl',
    description: 'Pechuga de pollo a la plancha con quinoa y brocoli asado.',
    price: 28000,
    calories: 520,
    protein: 48,
    carbs: 42,
    rating: 4.8,
    etaMinutes: 15,
    category: 'Almuerzos',
    featured: true,
    available: true,
    emoji: '🍲',
  },
  {
    id: 'dish-04',
    name: 'Acai Power Bowl',
    description: 'Bowl de acai con platano, fresas, granola y semillas.',
    price: 22000,
    calories: 380,
    protein: 12,
    carbs: 62,
    rating: 4.7,
    etaMinutes: 8,
    category: 'Desayunos',
    featured: true,
    available: true,
    emoji: '🫐',
  },
  {
    id: 'dish-05',
    name: 'Tuna Steak Fresh',
    description: 'Atun sellado con papas baby y ensalada crocante.',
    price: 42000,
    calories: 440,
    protein: 52,
    carbs: 22,
    rating: 4.7,
    etaMinutes: 18,
    category: 'Cenas',
    available: true,
    emoji: '🐟',
  },
  {
    id: 'dish-06',
    name: 'Avocado Toast Fit',
    description: 'Pan de centeno tostado con aguacate, huevo y microgreens.',
    price: 18000,
    calories: 410,
    protein: 18,
    carbs: 38,
    rating: 4.6,
    etaMinutes: 10,
    category: 'Desayunos',
    available: true,
    emoji: '🥑',
  },
  {
    id: 'dish-07',
    name: 'Protein Pancakes',
    description: 'Stack de 3 pancakes de avena con sirope y frutos rojos.',
    price: 18000,
    calories: 450,
    protein: 35,
    carbs: 52,
    rating: 4.6,
    etaMinutes: 12,
    category: 'Snacks',
    available: true,
    emoji: '🥞',
  },
  {
    id: 'dish-08',
    name: 'Green Detox Smoothie',
    description: 'Espinaca, pepino, manzana verde y limon organico.',
    price: 14000,
    calories: 180,
    protein: 4,
    carbs: 36,
    rating: 4.5,
    etaMinutes: 5,
    category: 'Smoothies',
    featured: true,
    available: true,
    emoji: '🥤',
  },
  {
    id: 'dish-09',
    name: 'Berry Chia Cup',
    description: 'Pudin de chia con frutos rojos y yogurt natural.',
    price: 16000,
    calories: 240,
    protein: 10,
    carbs: 28,
    rating: 4.5,
    etaMinutes: 6,
    category: 'Snacks',
    available: true,
    emoji: '🍓',
  },
  {
    id: 'dish-10',
    name: 'Energy Shot Mix',
    description: 'Batido energizante para pre-entreno con maca y cacao.',
    price: 9000,
    calories: 210,
    protein: 8,
    carbs: 24,
    rating: 4.2,
    etaMinutes: 6,
    category: 'Smoothies',
    available: false,
    emoji: '🍽️',
  },
]

// Filtros de categoria visibles en la parte superior del catalogo.
const categoryFilters: Array<{ id: ClientCategoryFilter; emoji: string; label: string }> = [
  { id: 'Todos', emoji: '🟢', label: 'Todos' },
  { id: 'Desayunos', emoji: '🍳', label: 'Desayunos' },
  { id: 'Almuerzos', emoji: '🥗', label: 'Almuerzos' },
  { id: 'Cenas', emoji: '🌙', label: 'Cenas' },
  { id: 'Smoothies', emoji: '🥤', label: 'Smoothies' },
  { id: 'Snacks', emoji: '⚡', label: 'Snacks' },
]

// Opciones de ordenamiento del select superior.
const sortOptions: Array<{ value: ClientMenuSortOption; label: string }> = [
  { value: 'top-rated', label: '⭐ Mejor valorados' },
  { value: 'price-asc', label: '💸 Precio menor' },
  { value: 'protein-desc', label: '💪 Mas proteina' },
]

// Formatea precio en UI del catalogo.
const formatPrice = (price: number): string => `COP ${price.toLocaleString('es-CO')}`

// Renderiza la vista principal de menu para cliente.
export default function ClientMenuView({ onBackToAccess }: ClientMenuViewProps) {
  // Guarda pestaña activa principal
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'checkout' | 'success' | 'account'>('menu')
  // Guarda ultimo pedido confirmado
  const [lastOrder, setLastOrder] = useState<OrderSuccessInfo | null>(null)
  
  // Guarda texto del buscador de platos.
  const [searchTerm, setSearchTerm] = useState<string>('')
  // Guarda categoria seleccionada.
  const [activeCategory, setActiveCategory] = useState<ClientCategoryFilter>('Todos')
  // Guarda criterio actual de ordenamiento.
  const [sortOption, setSortOption] = useState<ClientMenuSortOption>('top-rated')

  // Estado mock del carrito para la demostración
  const [cartItems, setCartItems] = useState<ClientCartItem[]>([
    {
      id: 'dish-01',
      name: 'Salmon Mediterráneo',
      subtext: 'Regular (180g)',
      quantity: 1,
      price: 34000,
      emoji: '🥗',
    },
    {
      id: 'dish-02',
      name: 'Meal Prep Box Semanal',
      subtext: '5 comidas',
      quantity: 3,
      price: 140000,
      emoji: '🍱',
    },
    {
      id: 'dish-03',
      name: 'Power Chicken Bowl',
      subtext: 'Regular',
      quantity: 1,
      price: 28000,
      emoji: '🍲',
    },
  ])
  const [promoCode, setPromoCode] = useState<string>('')

  // Controladores del carrito
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) }
      }
      return item
    }))
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const handleAddToCart = (dish: ClientDish) => {
    // Para simplificar, agregamos elementos basicos al hacer clic
    setCartItems(prev => {
      const exists = prev.find(item => item.id === dish.id)
      if (exists) {
        return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, {
        id: dish.id,
        name: dish.name,
        subtext: 'Regular',
        quantity: 1,
        price: dish.price,
        emoji: dish.emoji,
      }]
    })
  }

  // Aplica filtros y ordenamiento sobre dataset estatico.
  const visibleDishes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filtered = clientDishesData.filter((dish) => {
      const matchesCategory = activeCategory === 'Todos' || dish.category === activeCategory
      const matchesSearch =
        normalizedSearch.length === 0 ||
        dish.name.toLowerCase().includes(normalizedSearch) ||
        dish.description.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })

    const sorted = [...filtered]

    if (sortOption === 'top-rated') {
      sorted.sort((a, b) => b.rating - a.rating)
      return sorted
    }

    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price)
      return sorted
    }

    sorted.sort((a, b) => b.protein - a.protein)
    return sorted
  }, [activeCategory, searchTerm, sortOption])

  // Actualiza el valor del buscador principal.
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)
  }

  // Renderiza interfaz principal del cliente inspirada en la referencia.
  return (
    <div className="clientMenuView">
      <header className="clientMenuView__header">
        <div className="clientMenuView__headerInner">
          <div className="clientMenuView__brand" aria-label="Marca FitFuel">
            <span aria-hidden>🍃</span>
            <strong>FitFuel</strong>
          </div>

          <nav className="clientMenuView__nav" aria-label="Navegacion cliente">
            <button
              type="button"
              className={`clientMenuView__navLink ${activeTab === 'menu' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              🥗 Menu
            </button>
            <button
              type="button"
              className={`clientMenuView__navLink ${activeTab === 'cart' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('cart')}
            >
              🛒 Carrito {cartItems.length > 0 && <span className="clientMenuView__navBadge">{cartItems.length}</span>}
            </button>
            <button
              type="button"
              className={`clientMenuView__navLink ${activeTab === 'account' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              🧍 Mi cuenta
            </button>
          </nav>

          <div className="clientMenuView__userActions">
            <span className="clientMenuView__adminChip">Admin</span>
            <button type="button" className="clientMenuView__userMenu">
              <span aria-hidden>🧑</span>
              Sara
              <span aria-hidden>▾</span>
            </button>
            <button type="button" className="clientMenuView__exitButton" onClick={onBackToAccess}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="clientMenuView__main">
        {activeTab === 'menu' && (
          <div className="clientMenuView__content">
            <header className="clientMenuView__titleBlock">
              <h1>Menú FitFuel</h1>
              <p>Platos diseñados por nutriólogos certificados</p>
            </header>

            <section className="clientMenuView__controls" aria-label="Filtros de catalogo">
              <label className="clientMenuView__search" htmlFor="client-menu-search">
                <span aria-hidden>🔎</span>
                <input
                  id="client-menu-search"
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Buscar platos..."
                />
              </label>

              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as ClientMenuSortOption)}
                aria-label="Ordenar platos"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </section>

            <section className="clientMenuView__chips" aria-label="Categorias">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`clientMenuView__chip ${activeCategory === filter.id ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(filter.id)}
                >
                  <span aria-hidden>{filter.emoji}</span>
                  {filter.label}
                </button>
              ))}
            </section>

            <p className="clientMenuView__count">{visibleDishes.length} platos</p>

            <section className="clientMenuView__grid" aria-label="Listado de platos">
              {visibleDishes.map((dish) => (
                <article
                  key={dish.id}
                  className={`clientDishCard ${!dish.available ? 'is-unavailable' : ''}`}
                >
                  <div className="clientDishCard__media">
                    <span className="clientDishCard__emoji" aria-hidden>{dish.emoji}</span>

                    {dish.featured ? <span className="clientDishCard__badge">⭐ Destacado</span> : null}

                    {!dish.available ? (
                      <span className="clientDishCard__unavailable">No disponible</span>
                    ) : null}
                  </div>

                  <div className="clientDishCard__body">
                    <header className="clientDishCard__titleRow">
                      <h2>{dish.name}</h2>
                      <strong>{formatPrice(dish.price)}</strong>
                    </header>

                    <p className="clientDishCard__description">{dish.description}</p>

                    <div className="clientDishCard__macros" aria-label={`Macros de ${dish.name}`}>
                      <div>
                        <strong>{dish.calories}</strong>
                        <small>cal</small>
                      </div>
                      <div>
                        <strong>{dish.protein}g</strong>
                        <small>prot</small>
                      </div>
                      <div>
                        <strong>{dish.carbs}g</strong>
                        <small>carbs</small>
                      </div>
                    </div>

                    <footer className="clientDishCard__footer">
                      <p>
                        ⭐ {dish.rating.toFixed(1)} • {dish.etaMinutes}min
                      </p>
                      <button 
                        type="button" 
                        disabled={!dish.available}
                        onClick={() => handleAddToCart(dish)}
                      >
                        🛒 {dish.available ? 'Agregar' : 'Sin stock'}
                      </button>
                    </footer>
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}

        {activeTab === 'cart' && (
          <ClientCartView 
            items={cartItems}
            onAddMoreDishes={() => setActiveTab('menu')}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onApplyPromoCode={() => { /* Mock promo logic */ }}
            onProceedToCheckout={() => setActiveTab('checkout')}
          />
        )}

        {activeTab === 'checkout' && (
          <ClientCheckoutView 
            items={cartItems}
            onBackToCart={() => setActiveTab('cart')}
            onConfirmOrder={(method, totalAmount) => {
              setLastOrder({
                id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                deliveryMethod: method,
                estimatedMinutes: method === 'delivery' ? 35 : 15,
                totalPaid: totalAmount,
              })
              setCartItems([])
              setActiveTab('success')
            }}
          />
        )}

        {activeTab === 'success' && (
          <ClientOrderSuccessView
            orderInfo={lastOrder}
            onBackToHome={() => setActiveTab('menu')}
            onTrackOrder={() => {
              alert('Funcionalidad de seguimiento en desarrollo')
              setActiveTab('account')
            }}
          />
        )}
        
        {activeTab === 'account' && (
          <ClientAccountView
            onNavigateToMenu={() => setActiveTab('menu')}
            onLogout={onBackToAccess}
          />
        )}
      </main>
    </div>
  )
}
