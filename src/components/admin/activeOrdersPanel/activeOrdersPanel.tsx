// Importa tipo de pedido activo para tipado fuerte.
import type { ActiveOrder } from '../adminDashboard/adminDashboard.types'
import { updateOrderStatus } from '../../../services/firebase/orders.services'
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

// Maneja el progreso al siguiente paso
const handleNextStatus = async (orderId: string, currentStatus: ActiveOrder['status']) => {
  try {
    let nextStatus: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled' = 'pending';
    if (currentStatus === 'Recibido') nextStatus = 'preparing';
    else if (currentStatus === 'Preparando') nextStatus = 'delivered'; // Asumimos que de preparando pasa a en camino/entregado.
    else return; // Si era En camino, lo ignoramos

    await updateOrderStatus(orderId, nextStatus);
  } catch(error) {
    console.error("Error cambiando estado:", error);
    alert("Hubo un error actualizando la orden.");
  }
}

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
              <p className="activeOrdersPanel__id">{order.id.slice(0, 8)}...</p>
              <p className="activeOrdersPanel__meta">
                {order.customer} | {order.items} plato{order.items !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="activeOrdersPanel__summary">
              <strong className="activeOrdersPanel__total">{order.total}</strong>
              <p className={`activeOrdersPanel__status activeOrdersPanel__status--${toStatusClassName(order.status)}`}>
                {order.status}
              </p>
              
              {/* Botón dinámico según el progreso del platillo */}
              {order.status === 'Recibido' && (
                <button 
                   onClick={() => handleNextStatus(order.id, order.status)}
                   style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: 'var(--color-primary, green)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                   Empezar a Cocinar
                </button>
              )}
              {order.status === 'Preparando' && (
                <button 
                   onClick={() => handleNextStatus(order.id, order.status)}
                   style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: 'orange', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                   Enviar/Entregar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
