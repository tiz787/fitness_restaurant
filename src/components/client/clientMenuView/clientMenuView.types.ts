// Categorias visibles en la vista cliente del menu.
export type ClientDishCategory = 'Desayunos' | 'Almuerzos' | 'Cenas' | 'Smoothies' | 'Snacks'

// Opciones de ordenamiento del catalogo cliente.
export type ClientMenuSortOption = 'top-rated' | 'price-asc' | 'protein-desc'

// Secciones navegables en la vista cliente.
export type ClientViewSection = 'menu' | 'cart' | 'account'

// Define las props del modulo de menu para cliente.
export interface ClientMenuViewProps {
  // Permite volver a la pantalla de acceso.
  onBackToAccess: () => void
}
