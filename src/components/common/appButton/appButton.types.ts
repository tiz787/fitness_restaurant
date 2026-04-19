// Define las variantes visuales disponibles para el boton reusable.
export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

// Define las propiedades del componente boton para mantener consistencia.
export interface AppButtonProps {
  // Texto visible dentro del boton.
  label: string
  // Tipo HTML del boton para formularios o acciones simples.
  type?: 'button' | 'submit' | 'reset'
  // Variante visual para controlar color y jerarquia de accion.
  variant?: AppButtonVariant
  // Callback opcional para ejecutar una accion al hacer click.
  onClick?: () => void
  // Permite que el boton use todo el ancho disponible cuando es necesario.
  fullWidth?: boolean
}
