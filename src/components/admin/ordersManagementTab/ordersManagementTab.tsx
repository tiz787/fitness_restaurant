// Importa utilidades de estado y memo para filtros de tabla.
import { useMemo, useState, type ChangeEvent } from 'react'
// Importa tipos para modelar pedidos y estados.
import type { ManagedOrder, ManagedOrderStatus } from '../adminDashboard/adminDashboard.types'
// Importa estilos dedicados de la pestaña de pedidos.
import './ordersManagementTab.css'

// Define las props del componente de gestion de pedidos.
interface OrdersManagementTabProps {
  // Lista completa de pedidos estaticos para la UI admin.
  orders: ManagedOrder[]
}

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
export default function OrdersManagementTab({ orders }: OrdersManagementTabProps) {
  // Manejo de estado local para editar los pedidos (demo)
  const [localOrders, setLocalOrders] = useState<ManagedOrder[]>(orders)
  
  // Guarda el texto de busqueda por ID o cliente.
  const [searchTerm, setSearchTerm] = useState<string>('')
  // Guarda el filtro actual por estado del pedido.
  const [statusFilter, setStatusFilter] = useState<OrdersFilterStatus>('Todos los estados')

  // Modal detail
  const [selectedOrder, setSelectedOrder] = useState<ManagedOrder | null>(null)

  // Estado para feedback visual de actualizacion
  const [updatingOrders, setUpdatingOrders] = useState<Record<string, boolean>>({})

  // Funciones para avanzar y cancelar
  const advanceOrderStatus = (orderId: string) => {
    // 1. Mostrar estado de carga en el boton clickeado
    setUpdatingOrders(prev => ({ ...prev, [orderId]: true }))
    
    // 2. Simular un leve retraso de red para dar mejor feedback visual
    setTimeout(() => {
      setLocalOrders(prev => prev.map(o => {
        if (o.id !== orderId) return o;
        let nextStatus: ManagedOrderStatus = o.status;
        let nextAction = o.primaryAction;

        if (o.status === 'Recibido') {
          nextStatus = 'Preparando';
          nextAction = 'Marcar listo';
        } else if (o.status === 'Preparando') {
          nextStatus = 'Listo';
          nextAction = o.deliveryType === 'Delivery' ? 'Despachar' : 'Entregar';
        } else if (o.status === 'Listo') {
          if (o.deliveryType === 'Delivery') {
            nextStatus = 'En camino';
            nextAction = 'Marcar entregado';
          } else {
            nextStatus = 'Entregado';
            nextAction = undefined;
          }
        } else if (o.status === 'En camino') {
          nextStatus = 'Entregado';
          nextAction = undefined;
        }

        return { ...o, status: nextStatus, primaryAction: nextAction }
      }))

      // 3. Remover el estado de carga
      setUpdatingOrders(prev => {
        const next = { ...prev }
        delete next[orderId]
        return next
      })
    }, 500) // Medio segundo de feedback "Procesando..."
  }

  const cancelOrder = (orderId: string) => {
    if(confirm('¿Estás seguro de cancelar este pedido?')) {
      setLocalOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'Cancelado', primaryAction: undefined } : o
      ))
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
        <p className="ordersManagementTab__subtitle">{orders.length} pedidos en total</p>
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
                  <p className="ordersManagementTab__flag">{order.customerFlag}</p>
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
              <h3>Detalles del pedido {selectedOrder.id}</h3>
              <button 
                type="button" 
                className="ordersManagementTab__modalClose"
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </button>
            </header>
            <div className="ordersManagementTab__modalBody">
              <p><strong>Cliente:</strong> {selectedOrder.customerName} {selectedOrder.customerFlag}</p>
              <p><strong>Hora entrada:</strong> {selectedOrder.timeLabel}</p>
              <p><strong>Tipo entrega:</strong> {selectedOrder.deliveryType}</p>
              <p><strong>Estado actual:</strong> {selectedOrder.status}</p>
              <p><strong>Total:</strong> {selectedOrder.total}</p>
              
              <div className="ordersManagementTab__modalSection">
                <h4>Platos (Emojis de demo)</h4>
                <div className="ordersManagementTab__dishes">
                  {selectedOrder.dishEmojis.map((dishEmoji, index) => (
                    <span key={`${selectedOrder.id}-modal-${dishEmoji}-${index}`}>{dishEmoji}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
