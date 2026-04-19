// Importa los tipos para validar props del boton.
import type { AppButtonProps } from './appButton.types'
// Importa estilos dedicados del boton reutilizable.
import './appButton.css'

// Componente de boton reutilizable para mantener UX/UI coherente.
export default function AppButton({
  label,
  type = 'button',
  variant = 'primary',
  onClick,
  fullWidth = false,
}: AppButtonProps) {
  // Construye las clases dinamicas segun variante y ancho.
  const classNames = ['appButton', `appButton--${variant}`, fullWidth ? 'appButton--fullWidth' : '']
    .filter(Boolean)
    .join(' ')

  // Renderiza el boton final con etiqueta y comportamiento opcional.
  return (
    <button type={type} className={classNames} onClick={onClick}>
      {label}
    </button>
  )
}
