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
  // Guarda el texto de busqueda por ID o cliente.
  const [searchTerm, setSearchTerm] = useState<string>('')
  // Guarda el filtro actual por estado del pedido.
  const [statusFilter, setStatusFilter] = useState<OrdersFilterStatus>('Todos los estados')

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
    return orders.reduce((countMap, currentOrder) => {
      // Aumenta el contador del estado actual.
      countMap[currentOrder.status] += 1
      // Devuelve el acumulado actualizado para el reduce.
      return countMap
    }, initialCount)
  }, [orders])

  // Filtra pedidos por texto y estado seleccionado.
  const filteredOrders = useMemo(() => {
    // Normaliza termino de busqueda para comparar sin mayusculas.
    const normalizedSearch = searchTerm.trim().toLowerCase()

    // Devuelve solo pedidos que cumplen ambos filtros.
    return orders.filter((order) => {
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
  }, [orders, searchTerm, statusFilter])

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
                      <button type="button" className="ordersManagementTab__primaryAction">
                        {order.primaryAction}
                      </button>
                    ) : null}
                    <button type="button" className="ordersManagementTab__iconAction" aria-label="Ver detalle de pedido">
                      👁️
                    </button>
                    <button type="button" className="ordersManagementTab__iconAction" aria-label="Cancelar pedido">
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
