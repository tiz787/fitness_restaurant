// Importa tipo de pedido activo para tipado fuerte.
import type { ActiveOrder } from '../adminDashboard/adminDashboard.types'
// Importa estilos del panel de pedidos operativos.
import './activeOrdersPanel.css'

// Define props del panel de pedidos activos.
interface ActiveOrdersPanelProps {
  // Pedidos actuales que el admin debe monitorear.
  orders: ActiveOrder[]
}

// Convierte estado en nombre de clase CSS utilizable.
const toStatusClassName = (status: ActiveOrder['status']): string =>
  status.toLowerCase().replace(/\s+/g, '-')

// Renderiza tabla visual simplificada de pedidos activos.
export default function ActiveOrdersPanel({ orders }: ActiveOrdersPanelProps) {
  // Dibuja tarjeta con listado de pedidos y estados.
  return (
    <article className="activeOrdersPanel panelCard">
      <header className="panelCard__header">
        <h2 className="panelCard__title">Pedidos activos</h2>
        <span className="panelCard__chip">{orders.length} activos</span>
      </header>

      <ul className="activeOrdersPanel__list" aria-label="Pedidos en curso">
        {orders.map((order) => (
          <li key={order.id} className={`activeOrdersPanel__item activeOrdersPanel__item--${toStatusClassName(order.status)}`}>
            <div>
              <p className="activeOrdersPanel__id">{order.id}</p>
              <p className="activeOrdersPanel__meta">
                {order.customer} | {order.items} plato{order.items > 1 ? 's' : ''}
              </p>
            </div>

            <div className="activeOrdersPanel__summary">
              <strong className="activeOrdersPanel__total">{order.total}</strong>
              <p className={`activeOrdersPanel__status activeOrdersPanel__status--${toStatusClassName(order.status)}`}>
                {order.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
