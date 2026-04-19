// Importa estado local para filtros y busqueda del menu cliente.
import { useMemo, useState, type ChangeEvent } from 'react'
// Importa tipos de categorias y ordenamiento de la vista.
import type {
  ClientDishCategory,
  ClientMenuSortOption,
  ClientViewSection,
  ClientMenuViewProps,
} from './clientMenuView.types'
// Importa imagenes locales para tarjetas del menu.
import imagePechuga from '../../../assets/images/imagen2-PechugaAsadaFitness.jpeg'
import imageBowl from '../../../assets/images/imagen3-BuddhaBowlDetox.jpeg'
import imageAcai from '../../../assets/images/ensalada.jpeg'
import imageMealPrep from '../../../assets/images/pechuga.jpeg'
import imageToast from '../../../assets/images/imagen1-EnsaladaVeganaPremiun.jpeg'
import imagePancakes from '../../../assets/images/brownie.jpeg'
import imageDetox from '../../../assets/images/imagen5-BatidoGreenDetox.jpeg'
import imageTuna from '../../../assets/images/BuddhaBowlDetox.jpeg'
import imageFrutos from '../../../assets/images/imagen4-BrownieProteico.jpeg'
import imageUnavailable from '../../../assets/images/batido.jpeg'
// Importa estilos dedicados de la vista cliente.
import './clientMenuView.css'

// Define la forma de un platillo en el catalogo cliente.
interface ClientDish {
  id: string
  name: string
  description: string
  servingLabel: string
  price: number
  calories: number
  protein: number
  carbs: number
  rating: number
  etaMinutes: number
  category: ClientDishCategory
  featured?: boolean
  available: boolean
  image: string
}

// Define estructura para filas del carrito cliente.
interface ClientCartItem {
  dish: ClientDish
  quantity: number
}

// Define filtro de categoria (incluye opcion global).
type ClientCategoryFilter = 'Todos' | ClientDishCategory

// Dataset estatico de platillos para la primera version visual cliente.
const clientDishesData: ClientDish[] = [
  {
    id: 'dish-01',
    name: 'Salmon Mediterraneo',
    description: 'Filete de salmon al horno con vegetales mediterraneos y quinoa.',
    servingLabel: 'Regular (180g)',
    price: 245,
    calories: 480,
    protein: 42,
    carbs: 18,
    rating: 4.9,
    etaMinutes: 20,
    category: 'Cenas',
    featured: true,
    available: true,
    image: imagePechuga,
  },
  {
    id: 'dish-02',
    name: 'Meal Prep Box Semanal',
    description: 'Caja con 5 comidas balanceadas para tu semana fitness.',
    servingLabel: '5 comidas',
    price: 699,
    calories: 480,
    protein: 40,
    carbs: 50,
    rating: 4.9,
    etaMinutes: 30,
    category: 'Almuerzos',
    featured: true,
    available: true,
    image: imageMealPrep,
  },
  {
    id: 'dish-03',
    name: 'Power Chicken Bowl',
    description: 'Pechuga de pollo a la plancha con quinoa y brocoli asado.',
    servingLabel: 'Regular',
    price: 189,
    calories: 520,
    protein: 48,
    carbs: 42,
    rating: 4.8,
    etaMinutes: 15,
    category: 'Almuerzos',
    featured: true,
    available: true,
    image: imageBowl,
  },
  {
    id: 'dish-04',
    name: 'Acai Power Bowl',
    description: 'Bowl de acai con platano, fresas, granola y semillas.',
    servingLabel: 'Regular',
    price: 155,
    calories: 380,
    protein: 12,
    carbs: 62,
    rating: 4.7,
    etaMinutes: 8,
    category: 'Desayunos',
    featured: true,
    available: true,
    image: imageAcai,
  },
  {
    id: 'dish-05',
    name: 'Tuna Steak & Veggies',
    description: 'Atun sellado con papas baby y ensalada crocante.',
    servingLabel: 'Regular',
    price: 265,
    calories: 440,
    protein: 52,
    carbs: 22,
    rating: 4.7,
    etaMinutes: 18,
    category: 'Cenas',
    available: true,
    image: imageTuna,
  },
  {
    id: 'dish-06',
    name: 'Avocado Toast Fit',
    description: 'Pan de centeno tostado con aguacate, huevo y microgreens.',
    servingLabel: '1 porcion',
    price: 135,
    calories: 410,
    protein: 18,
    carbs: 38,
    rating: 4.6,
    etaMinutes: 10,
    category: 'Desayunos',
    available: true,
    image: imageToast,
  },
  {
    id: 'dish-07',
    name: 'Protein Pancakes',
    description: 'Stack de 3 pancakes de avena con sirope y frutos rojos.',
    servingLabel: '3 piezas',
    price: 125,
    calories: 450,
    protein: 35,
    carbs: 52,
    rating: 4.6,
    etaMinutes: 12,
    category: 'Snacks',
    available: true,
    image: imagePancakes,
  },
  {
    id: 'dish-08',
    name: 'Green Detox Smoothie',
    description: 'Espinaca, pepino, manzana verde y limon organico.',
    servingLabel: '500ml',
    price: 95,
    calories: 180,
    protein: 4,
    carbs: 36,
    rating: 4.5,
    etaMinutes: 5,
    category: 'Smoothies',
    featured: true,
    available: true,
    image: imageDetox,
  },
  {
    id: 'dish-09',
    name: 'Berry Chia Cup',
    description: 'Pudin de chia con frutos rojos y yogurt natural.',
    servingLabel: '1 vaso',
    price: 115,
    calories: 240,
    protein: 10,
    carbs: 28,
    rating: 4.5,
    etaMinutes: 6,
    category: 'Snacks',
    available: true,
    image: imageFrutos,
  },
  {
    id: 'dish-10',
    name: 'Energy Shot Mix',
    description: 'Batido energizante para pre-entreno con maca y cacao.',
    servingLabel: '300ml',
    price: 85,
    calories: 210,
    protein: 8,
    carbs: 24,
    rating: 4.2,
    etaMinutes: 6,
    category: 'Smoothies',
    available: false,
    image: imageUnavailable,
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
const formatPrice = (price: number): string => `$${price}`

// Renderiza la vista principal de menu para cliente.
export default function ClientMenuView({ onBackToAccess }: ClientMenuViewProps) {
  // Guarda seccion activa dentro de la vista cliente.
  const [activeSection, setActiveSection] = useState<ClientViewSection>('menu')
  // Guarda texto del buscador de platos.
  const [searchTerm, setSearchTerm] = useState<string>('')
  // Guarda categoria seleccionada.
  const [activeCategory, setActiveCategory] = useState<ClientCategoryFilter>('Todos')
  // Guarda criterio actual de ordenamiento.
  const [sortOption, setSortOption] = useState<ClientMenuSortOption>('top-rated')
  // Guarda cantidades del carrito por id de plato.
  const [cartByDishId, setCartByDishId] = useState<Record<string, number>>({})
  // Guarda codigo de cupon escrito en resumen.
  const [couponCode, setCouponCode] = useState<string>('FIT10')
  // Controla mensaje visual de cupon aplicado.
  const [couponApplied, setCouponApplied] = useState<boolean>(false)

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

  // Calcula items visibles actualmente dentro del carrito.
  const cartItems = useMemo<ClientCartItem[]>(() => {
    return clientDishesData
      .map((dish) => ({ dish, quantity: cartByDishId[dish.id] ?? 0 }))
      .filter((item) => item.quantity > 0)
  }, [cartByDishId])

  // Cuenta total de unidades en el carrito para badge.
  const cartUnitsCount = useMemo(
    () => cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [cartItems],
  )

  // Suma total sin descuentos del carrito actual.
  const cartSubtotal = useMemo(
    () => cartItems.reduce((accumulator, item) => accumulator + item.dish.price * item.quantity, 0),
    [cartItems],
  )

  // Define envio actual para el resumen (gratis en esta fase visual).
  const shippingCost = cartSubtotal > 0 ? 0 : 0
  // Total final de orden para checkout visual.
  const cartTotal = cartSubtotal + shippingCost

  // Agrega una unidad del plato al carrito y activa feedback de tab.
  const addDishToCart = (dishId: string): void => {
    setCartByDishId((previousCart) => ({
      ...previousCart,
      [dishId]: (previousCart[dishId] ?? 0) + 1,
    }))
  }

  // Incrementa cantidad de un item existente dentro del carrito.
  const increaseDishQuantity = (dishId: string): void => {
    addDishToCart(dishId)
  }

  // Reduce cantidad de item; si llega a cero lo elimina del carrito.
  const decreaseDishQuantity = (dishId: string): void => {
    setCartByDishId((previousCart) => {
      const currentQuantity = previousCart[dishId] ?? 0

      if (currentQuantity <= 1) {
        const { [dishId]: _removed, ...restCart } = previousCart
        return restCart
      }

      return {
        ...previousCart,
        [dishId]: currentQuantity - 1,
      }
    })
  }

  // Elimina por completo una linea del carrito.
  const removeDishFromCart = (dishId: string): void => {
    setCartByDishId((previousCart) => {
      const { [dishId]: _removed, ...restCart } = previousCart
      return restCart
    })
  }

  // Marca cupon como aplicado si hay texto escrito.
  const handleApplyCoupon = (): void => {
    setCouponApplied(couponCode.trim().length > 0)
  }

  // Renderiza contenido principal del menu (catalogo de platos).
  const renderMenuSection = () => (
    <>
      <header className="clientMenuView__titleBlock">
        <h1>Menu FitFuel</h1>
        <p>Platos disenados por nutriologos certificados</p>
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
          <article key={dish.id} className={`clientDishCard ${!dish.available ? 'is-unavailable' : ''}`}>
            <div className="clientDishCard__media">
              <img src={dish.image} alt={dish.name} loading="lazy" />

              {dish.featured ? <span className="clientDishCard__badge">⭐ Destacado</span> : null}

              {!dish.available ? <span className="clientDishCard__unavailable">No disponible</span> : null}
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
                  onClick={() => addDishToCart(dish.id)}
                >
                  🛒 {dish.available ? 'Agregar' : 'Sin stock'}
                </button>
              </footer>
            </div>
          </article>
        ))}
      </section>
    </>
  )

  // Renderiza contenido de carrito vacio o con productos.
  const renderCartSection = () => {
    if (cartItems.length === 0) {
      return (
        <section className="clientCartEmpty" aria-label="Carrito vacio">
          <p className="clientCartEmpty__icon" aria-hidden>
            🛒
          </p>
          <h1>Tu carrito esta vacio</h1>
          <p>Descubre nuestros platos fitness y empieza a armar tu pedido perfecto.</p>
          <button type="button" onClick={() => setActiveSection('menu')}>
            Explorar menu ↗
          </button>
        </section>
      )
    }

    return (
      <section className="clientCartView" aria-label="Resumen de carrito">
        <header className="clientCartView__header">
          <h1>Mi carrito</h1>
          <p>{cartItems.length} productos</p>
        </header>

        <div className="clientCartView__layout">
          <div className="clientCartView__items">
            {cartItems.map((item) => (
              <article key={item.dish.id} className="clientCartItem">
                <img src={item.dish.image} alt={item.dish.name} loading="lazy" />

                <div className="clientCartItem__content">
                  <div>
                    <h2>{item.dish.name}</h2>
                    <p>{item.dish.servingLabel}</p>
                  </div>

                  <div className="clientCartItem__controls">
                    <button type="button" onClick={() => decreaseDishQuantity(item.dish.id)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => increaseDishQuantity(item.dish.id)}>
                      +
                    </button>
                  </div>
                </div>

                <div className="clientCartItem__right">
                  <button
                    type="button"
                    className="clientCartItem__remove"
                    onClick={() => removeDishFromCart(item.dish.id)}
                    aria-label={`Eliminar ${item.dish.name}`}
                  >
                    🗑
                  </button>
                  <strong>{formatPrice(item.dish.price * item.quantity)}</strong>
                </div>
              </article>
            ))}

            <button type="button" className="clientCartView__addMore" onClick={() => setActiveSection('menu')}>
              🧾 Agregar mas platos
            </button>
          </div>

          <aside className="clientCartSummary" aria-label="Resumen del pedido">
            <h3>Resumen del pedido</h3>

            <label htmlFor="client-coupon-code">Codigo de descuento</label>
            <div className="clientCartSummary__couponRow">
              <input
                id="client-coupon-code"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="FIT10"
              />
              <button type="button" onClick={handleApplyCoupon}>
                Aplicar
              </button>
            </div>

            <p className="clientCartSummary__couponHint">Prueba: FIT10, PRIMERA10, ENVIOGRATIS</p>
            {couponApplied ? (
              <p className="clientCartSummary__couponApplied">Cupon aplicado visualmente.</p>
            ) : null}

            <div className="clientCartSummary__line">
              <span>Subtotal</span>
              <strong>{formatPrice(cartSubtotal)}</strong>
            </div>

            <div className="clientCartSummary__line">
              <span>Envio</span>
              <strong className="is-green">{shippingCost === 0 ? '¡Gratis!' : formatPrice(shippingCost)}</strong>
            </div>

            <div className="clientCartSummary__line clientCartSummary__line--total">
              <span>Total</span>
              <strong className="is-green">{formatPrice(cartTotal)}</strong>
            </div>

            <button type="button" className="clientCartSummary__payButton">
              Proceder al pago → {formatPrice(cartTotal)}
            </button>

            <p className="clientCartSummary__security">🔒 Pago seguro • Sin cargos ocultos</p>
          </aside>
        </div>
      </section>
    )
  }

  // Renderiza seccion de cuenta como placeholder no bloqueante.
  const renderAccountSection = () => (
    <section className="clientAccountPlaceholder" aria-label="Mi cuenta">
      <h1>Mi cuenta</h1>
      <p>Esta seccion se construira en el siguiente paso.</p>
    </section>
  )

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
              className={`clientMenuView__navLink ${activeSection === 'menu' ? 'is-active' : ''}`}
              onClick={() => setActiveSection('menu')}
            >
              🥗 Menu
            </button>
            <button
              type="button"
              className={`clientMenuView__navLink ${activeSection === 'cart' ? 'is-active' : ''}`}
              onClick={() => setActiveSection('cart')}
            >
              🛒 Carrito
              {cartUnitsCount > 0 ? <span className="clientMenuView__navBadge">{cartUnitsCount}</span> : null}
            </button>
            <button
              type="button"
              className={`clientMenuView__navLink ${activeSection === 'account' ? 'is-active' : ''}`}
              onClick={() => setActiveSection('account')}
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
        <div className="clientMenuView__content">
          {activeSection === 'menu' ? renderMenuSection() : null}
          {activeSection === 'cart' ? renderCartSection() : null}
          {activeSection === 'account' ? renderAccountSection() : null}
        </div>
      </main>
    </div>
  )
}
