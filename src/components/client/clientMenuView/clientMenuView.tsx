// Importa estado y hooks de React
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
// Importa Firebase services
import { listenToAllProducts } from '../../../services/firebase/products.services'
import { createOrder } from '../../../services/firebase/orders.services'
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

// Eliminar los platos estáticos ya que ahora son obtenidos de Firebase en setClientDishesData

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
  // Estado local para los productos dinámicos de Firebase
  const [clientDishesData, setClientDishesData] = useState<ClientDish[]>([])
  
  // Efecto para escuchar los productos en tiempo real desde Firebase
  useEffect(() => {
    // Nos suscribimos a Firebase y convertimos ProductDocument a ClientDish
    const unsubscribe = listenToAllProducts((products) => {
      const mappedDishes: ClientDish[] = products.map((prod) => ({
        id: prod.id || '',
        name: prod.name,
        description: prod.description,
        price: prod.price,
        calories: prod.macros?.calories || 0,
        protein: prod.macros?.protein || 0,
        carbs: prod.macros?.carbs || 0,
        rating: 5.0, // Default for now
        etaMinutes: 15, // Default for now
        category: prod.category as ClientDishCategory, // Mapeo directo
        available: prod.isActive,
        emoji: prod.imageUrl || '🍽️', // Usando imageUrl para el emoji temporalmente
      }))
      setClientDishesData(mappedDishes)
    })
    
    // Limpiamos el proceso cuando se cierra el componente
    return () => unsubscribe()
  }, [])

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

  // Estado del carrito vacio para iniciar realmente en limpio conectado a Firebase
  const [cartItems, setCartItems] = useState<ClientCartItem[]>([])
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
      // Usamos toLowerCase() en ambos lados para asegurarnos de que "Cenas" valga igual que "cenas"
      // y prevenir problemas con lo que escribe el admin desde Firestore
      const dishCat = (dish.category || '').toLowerCase()
      const searchCat = activeCategory.toLowerCase()
      const matchesCategory = activeCategory === 'Todos' || dishCat === searchCat
      const matchesSearch =
        normalizedSearch.length === 0 ||
        dish.name.toLowerCase().includes(normalizedSearch) ||
        dish.description.toLowerCase().includes(normalizedSearch)

      // Además filtramos solo los activados ("isActive: true" -> "available: true")
      return matchesCategory && matchesSearch && dish.available
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
  }, [clientDishesData, activeCategory, searchTerm, sortOption])

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
            onConfirmOrder={async (method, totalAmount) => {
              try {
                // Sincronización en tiempo real: Guardamos la orden en Firebase
                const newOrderId = await createOrder({
                  userId: 'user-demo-123', // ID temporal hasta conectar Firebase Auth
                  items: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalPrice: item.price * item.quantity
                  })),
                  subtotal: totalAmount,
                  taxes: 0,
                  total: totalAmount,
                  status: 'pending',
                  // createdAt es inyectado por nuestro service (serverTimestamp)
                });

                // Pasamos al usuario a la pantalla de éxito con el ID real
                setLastOrder({
                  id: newOrderId, // ID directo de Firebase Firestore
                  deliveryMethod: method,
                  estimatedMinutes: method === 'delivery' ? 35 : 15,
                  totalPaid: totalAmount,
                })
                
                // Vaciamos carrito
                setCartItems([])
                setActiveTab('success')
                
              } catch (error) {
                console.error("Error procesando pedido:", error)
                alert("Hubo un problema guardando tu pedido.")
              }
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
