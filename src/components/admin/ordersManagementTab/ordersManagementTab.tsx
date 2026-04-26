// Importa utilidades de estado y memo para filtros de tabla.
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
// Importa Firebase services
import { listenToAllOrders, updateOrderStatus } from '../../../services/firebase/orders.services'
// Importa tipos para modelar pedidos y estados.
import type { ManagedOrder, ManagedOrderStatus } from '../adminDashboard/adminDashboard.types'
// Importa estilos dedicados de la pestaña de pedidos.
import './ordersManagementTab.css'

// Define el tipo de filtro de estado (incluye opcion global).
type OrdersFilterStatus = ManagedOrderStatus | 'Todos los estados'

// Define el orden visual de las tarjetas de estado superiores.
const statusCards: ManagedOrderStatus[] = [
  'Recibido',
  'Preparando',
  'Listo',
  'En camino',
  'Entregado',
  'Cancelado',
]

// Convierte estado a token CSS para aplicar estilos por color.
const toStatusToken = (status: ManagedOrderStatus): string => status.toLowerCase().replace(/\s+/g, '-')

// Renderiza la pestaña completa de gestion de pedidos del admin.
export default function OrdersManagementTab() {
  // Manejo de estado local para editar los pedidos desde Firebase
  const [localOrders, setLocalOrders] = useState<ManagedOrder[]>([])
  
  // Guarda el texto de busqueda por ID o cliente.
  const [searchTerm, setSearchTerm] = useState<string>('')
  // Guarda el filtro actual por estado del pedido.
  const [statusFilter, setStatusFilter] = useState<OrdersFilterStatus>('Todos los estados')

  // Modal detail
  const [selectedOrder, setSelectedOrder] = useState<ManagedOrder | null>(null)

  // Estado para feedback visual de actualizacion
  const [updatingOrders, setUpdatingOrders] = useState<Record<string, boolean>>({})

  // Suscripción al stream de Firebase de las órdenes en tiempo real
  useEffect(() => {
    const unsubscribe = listenToAllOrders((incomingOrders) => {
      const mappedOrders: ManagedOrder[] = incomingOrders.map(doc => {
        let uiStatus: ManagedOrderStatus = 'Recibido';
        let primaryAction: string | undefined = 'Empezar a preparar';

        if (doc.status === 'preparing') {
          uiStatus = 'Preparando';
          primaryAction = 'Marcar listo';
        } else if (doc.status === 'ready') {
          uiStatus = 'Listo';
          primaryAction = 'Despachar / Entregar';
        } else if (doc.status === 'delivered') {
          uiStatus = 'Entregado';
          primaryAction = undefined;
        } else if (doc.status === 'cancelled') {
          uiStatus = 'Cancelado';
          primaryAction = undefined;
        }

        let dateObj = new Date();
        if (doc.createdAt) {
          // Si es un Timestamp de Firebase
          const createdAtTyped = doc.createdAt as unknown as { toDate?: () => Date };
          if (typeof createdAtTyped.toDate === 'function') {
            dateObj = createdAtTyped.toDate();
          } else if (typeof doc.createdAt === 'string' || typeof doc.createdAt === 'number') {
            dateObj = new Date(doc.createdAt);
          }
        }
        
        const timeStr = isNaN(dateObj.getTime()) ? 'Ahora' : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          id: doc.id || 'N/A',
          timeLabel: timeStr,
          customerName: doc.userId || 'Cliente web',
          dishEmojis: doc.items?.map(item => item.emoji || '🍽️').slice(0, 3) || ['🥡'],
          fullItems: doc.items || [],
          subtotal: doc.subtotal || doc.total,
          numericTotal: doc.total || 0,
          total: `COP ${doc.total.toLocaleString('es-CO')}`,
          deliveryType: 'Delivery',
          status: uiStatus,
          primaryAction: primaryAction
        };
      })
      
      setLocalOrders(mappedOrders)
    })
    
    return () => unsubscribe()
  }, [])

  // Funciones para avanzar y cancelar
  const advanceOrderStatus = async (orderId: string) => {
    setUpdatingOrders(prev => ({ ...prev, [orderId]: true }))
    
    try {
      const order = localOrders.find(o => o.id === orderId);
      if (order) {
        let nextDbStatus: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | undefined = undefined;
        if (order.status === 'Recibido') nextDbStatus = 'preparing';
        else if (order.status === 'Preparando') nextDbStatus = 'ready';
        else if (order.status === 'Listo') nextDbStatus = 'delivered';
        else if (order.status === 'En camino') nextDbStatus = 'delivered';

        if (nextDbStatus) {
          await updateOrderStatus(orderId, nextDbStatus);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error avanzando orden');
    } finally {
      setUpdatingOrders(prev => {
        const next = { ...prev }
        delete next[orderId]
        return next
      })
    }
  }

  const cancelOrder = async (orderId: string) => {
    if(confirm('¿Estás seguro de cancelar este pedido?')) {
      try {
        await updateOrderStatus(orderId, 'cancelled');
      } catch (error) {
        console.error(error);
        alert('Error cancelando orden');
      }
    }
  }

  // Genera el contador por estado para las tarjetas resumen superiores.
  const statusCountMap = useMemo(() => {
    // Inicializa el mapa con todas las llaves en cero.
    const initialCount: Record<ManagedOrderStatus, number> = {
      Recibido: 0,
      Preparando: 0,
      Listo: 0,
      'En camino': 0,
      Entregado: 0,
      Cancelado: 0,
    }

    // Recorre pedidos y suma uno segun estado detectado.
    return localOrders.reduce((countMap, currentOrder) => {
      // Aumenta el contador del estado actual.
      countMap[currentOrder.status] += 1
      // Devuelve el acumulado actualizado para el reduce.
      return countMap
    }, initialCount)
  }, [localOrders])

  // Filtra pedidos por texto y estado seleccionado.
  const filteredOrders = useMemo(() => {
    // Normaliza termino de busqueda para comparar sin mayusculas.
    const normalizedSearch = searchTerm.trim().toLowerCase()

    // Devuelve solo pedidos que cumplen ambos filtros.
    return localOrders.filter((order) => {
      // Verifica coincidencia contra ID o nombre de cliente.
      const matchBySearch =
        normalizedSearch.length === 0 ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.customerName.toLowerCase().includes(normalizedSearch)

      // Verifica coincidencia por estado seleccionado.
      const matchByStatus = statusFilter === 'Todos los estados' || order.status === statusFilter

      // Mantiene pedido solo si cumple ambos criterios.
      return matchBySearch && matchByStatus
    })
  }, [localOrders, searchTerm, statusFilter])

  // Actualiza el estado de busqueda cuando el usuario escribe.
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    // Guarda el valor actual del input de busqueda.
    setSearchTerm(event.target.value)
  }

  // Actualiza el estado del filtro cuando cambia el select.
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    // Convierte el string del select al tipo seguro del filtro.
    const nextStatus = event.target.value as OrdersFilterStatus
    // Guarda el nuevo filtro de estado activo.
    setStatusFilter(nextStatus)
  }

  // Renderiza encabezado, filtros y tabla de pedidos.
  return (
    <section className="ordersManagementTab" aria-label="Gestion de pedidos">
      <header className="ordersManagementTab__header">
        <h2 className="ordersManagementTab__title">Gestion de pedidos</h2>
        <p className="ordersManagementTab__subtitle">{localOrders.length} pedidos en total</p>
      </header>

      <div className="ordersManagementTab__statusGrid" aria-label="Resumen por estado">
        {statusCards.map((status) => (
          <article key={status} className={`ordersStatusCard ordersStatusCard--${toStatusToken(status)}`}>
            <p className="ordersStatusCard__value">{statusCountMap[status]}</p>
            <p className="ordersStatusCard__label">{status}</p>
          </article>
        ))}
      </div>

      <div className="ordersManagementTab__filters">
        <label className="ordersManagementTab__search" htmlFor="orders-search-input">
          <span aria-hidden>🔎</span>
          <input
            id="orders-search-input"
            type="search"
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>

        <select value={statusFilter} onChange={handleStatusChange} aria-label="Filtrar por estado">
          <option>Todos los estados</option>
          {statusCards.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="ordersManagementTab__tableWrapper">
        <table className="ordersManagementTab__table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Platos</th>
              <th>Total</th>
              <th>Entrega</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <p className="ordersManagementTab__orderId">{order.id}</p>
                  <p className="ordersManagementTab__time">{order.timeLabel}</p>
                </td>

                <td>
                  <p className="ordersManagementTab__customerName">{order.customerName}</p>
                </td>

                <td>
                  <div className="ordersManagementTab__dishes" aria-label="Platos del pedido">
                    {order.dishEmojis.map((dishEmoji, index) => (
                      <span key={`${order.id}-${dishEmoji}-${index}`}>{dishEmoji}</span>
                    ))}
                  </div>
                </td>

                <td className="ordersManagementTab__total">{order.total}</td>

                <td>
                  {order.deliveryType === 'Delivery' ? '🛵 Delivery' : '🏪 Retiro'}
                </td>

                <td>
                  <span className={`ordersManagementTab__status ordersManagementTab__status--${toStatusToken(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                <td>
                  <div className="ordersManagementTab__actions">
                    {order.primaryAction ? (
                      <button 
                        type="button" 
                        className={`ordersManagementTab__primaryAction ${updatingOrders[order.id] ? 'is-loading' : ''}`}
                        onClick={() => advanceOrderStatus(order.id)}
                        disabled={updatingOrders[order.id]}
                      >
                        {updatingOrders[order.id] ? 'Cambiando...' : order.primaryAction}
                      </button>
                    ) : null}
                    <button 
                      type="button" 
                      className="ordersManagementTab__iconAction" 
                      aria-label="Ver detalle de pedido"
                      onClick={() => setSelectedOrder(order)}
                    >
                      👁️
                    </button>
                    {order.status !== 'Cancelado' && order.status !== 'Entregado' && (
                      <button 
                        type="button" 
                        className="ordersManagementTab__iconAction" 
                        aria-label="Cancelar pedido"
                        onClick={() => cancelOrder(order.id)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="ordersManagementTab__modalOverlay" onClick={() => setSelectedOrder(null)}>
          <div className="ordersManagementTab__modalContent" onClick={(e) => e.stopPropagation()}>
            <header className="ordersManagementTab__modalHeader">
              <div className="ordersManagementTab__modalHeaderInfo">
                <h3>Pedido #{selectedOrder.id.substring(0, 8)}</h3>
                <p>Cliente: {selectedOrder.customerName.length > 15 ? selectedOrder.customerName.substring(0, 15) + '...' : selectedOrder.customerName} • {selectedOrder.timeLabel}</p>
              </div>
              <button 
                type="button" 
                className="ordersManagementTab__modalClose"
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </button>
            </header>
            <div className="ordersManagementTab__modalBody">
              <div style={{ marginBottom: '1.5rem' }}>
                <p>
                  <strong>Estado:</strong>{' '}
                  {selectedOrder.status === 'Recibido' ? '📥' : selectedOrder.status === 'Preparando' ? '👨‍🍳' : selectedOrder.status === 'Listo' ? '✅' : selectedOrder.status === 'En camino' ? '🛵' : selectedOrder.status === 'Entregado' ? '📦' : selectedOrder.status === 'Cancelado' ? '❌' : '🔘'} {selectedOrder.status} |{' '}
                  <strong>Tipo entrega:</strong>{' '}
                  {selectedOrder.deliveryType === 'Delivery' ? '🛵 Delivery' : '🏪 Retiro en local'}
                </p>
              </div>
              
              <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Detalle de Platos</h4>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedOrder.fullItems?.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '0.8rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.5rem' }} title={item.name}>{item.emoji || '🍽️'}</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>{item.emoji || '🍽️'} {item.name}</p>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                          Cant: {item.quantity} × COP {item.unitPrice.toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>COP {item.totalPrice.toLocaleString('es-CO')}</p>
                  </li>
                ))}
              </ul>
              
              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                  <span>Subtotal</span>
                  <span>COP {selectedOrder.subtotal?.toLocaleString('es-CO') || selectedOrder.total.replace('COP ', '')}</span>
                </div>
                {selectedOrder.subtotal && selectedOrder.numericTotal !== undefined && selectedOrder.numericTotal < selectedOrder.subtotal && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e74c3c' }}>
                    <span>Descuento aplicado</span>
                    <span>- COP {(selectedOrder.subtotal - selectedOrder.numericTotal).toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #ccc' }}>
                  <span>Total</span>
                  <span>{selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
