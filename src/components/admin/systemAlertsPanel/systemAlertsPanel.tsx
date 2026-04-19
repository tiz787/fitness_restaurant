// Importa tipo de alerta para panel operativo.
import type { SystemAlert } from '../adminDashboard/adminDashboard.types'
// Importa estilos del panel de alertas.
import './systemAlertsPanel.css'

// Define props requeridas por el panel de alertas.
interface SystemAlertsPanelProps {
  // Alertas activas para mostrar en dashboard.
  alerts: SystemAlert[]
}

// Renderiza alertas de negocio para accion rapida del administrador.
export default function SystemAlertsPanel({ alerts }: SystemAlertsPanelProps) {
  // Dibuja panel completo con cabecera y mensajes.
  return (
    <section className="systemAlertsPanel panelCard" aria-label="Alertas del sistema">
      <header className="panelCard__header">
        <h2 className="panelCard__title">Alertas del sistema</h2>
      </header>

      <ul className="systemAlertsPanel__list">
        {alerts.map((alert) => (
          <li key={alert.id}>
            <span aria-hidden>!</span>
            <p>{alert.message}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
