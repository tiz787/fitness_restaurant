// Importa el boton reusable para navegar de regreso.
import AppButton from '../../common/appButton/appButton'
// Importa el tipo de props para validar el componente.
import type { ClientComingSoonProps } from './clientComingSoon.types'
// Importa estilos locales de la vista temporal cliente.
import './clientComingSoon.css'

// Muestra un placeholder mientras la experiencia cliente se construye paso a paso.
export default function ClientComingSoon({ onBackToAccess }: ClientComingSoonProps) {
  // Renderiza el mensaje de "proximamente" con accion de retorno.
  return (
    <section className="clientComingSoon" aria-label="Vista cliente en construccion">
      <p className="clientComingSoon__eyebrow">Vista Cliente</p>
      <h2 className="clientComingSoon__title">Proximamente tendremos esta seccion lista</h2>
      <p className="clientComingSoon__description">
        Por ahora construimos solo UX/UI de Admin. Cuando me compartas la estructura del cliente,
        montamos esa segunda pestaña con el mismo nivel visual.
      </p>
      <AppButton label="Volver al acceso" variant="ghost" onClick={onBackToAccess} />
    </section>
  )
}
