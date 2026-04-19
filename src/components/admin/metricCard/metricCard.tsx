// Importa tipos para renderizar metrica con contrato seguro.
import type { DashboardMetric } from '../adminDashboard/adminDashboard.types'
// Importa estilos locales de la tarjeta KPI.
import './metricCard.css'

// Define props del componente KPI reutilizable.
interface MetricCardProps {
  // Metrica individual con valor, etiqueta y tono visual.
  metric: DashboardMetric
}

// Dibuja una tarjeta de metrica de la fila superior del dashboard.
export default function MetricCard({ metric }: MetricCardProps) {
  // Retorna estructura visual de icono, badge y valor principal.
  return (
    <article className={`metricCard metricCard--${metric.tone}`} aria-label={metric.label}>
      <div className="metricCard__header">
        <span className="metricCard__icon">{metric.icon}</span>
        <span className="metricCard__badge">{metric.badge}</span>
      </div>
      <p className="metricCard__value">{metric.value}</p>
      <p className="metricCard__label">{metric.label}</p>
    </article>
  )
}
