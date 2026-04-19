// Importa estado y memo para filtros y visualizacion de clientes.
import { useMemo, useState, type ChangeEvent } from 'react'
// Importa tipo de usuario gestionado por admin.
import type { ManagedUser } from '../adminDashboard/adminDashboard.types'
// Importa estilos dedicados de la pestaña usuarios.
import './usersManagementTab.css'

// Define props del modulo de usuarios admin.
interface UsersManagementTabProps {
  // Lista inicial de clientes para gestion visual.
  initialUsers: ManagedUser[]
}

// Define opciones de filtro por antiguedad.
type AntiquityFilter = 'Todos' | '0-12 meses' | '13-24 meses' | '25+ meses'

// Define opciones de filtro por numero de pedidos.
type OrdersCountFilter = 'Todos' | '1-5 pedidos' | '6-10 pedidos' | '11+ pedidos'

// Evalua si un usuario cumple el filtro de antiguedad seleccionado.
const matchesAntiquityFilter = (memberMonths: number, filter: AntiquityFilter): boolean => {
  // Retorna true para filtro general sin restricciones.
  if (filter === 'Todos') {
    return true
  }

  // Aplica filtro de usuarios nuevos hasta 12 meses.
  if (filter === '0-12 meses') {
    return memberMonths <= 12
  }

  // Aplica filtro de antiguedad media entre 13 y 24 meses.
  if (filter === '13-24 meses') {
    return memberMonths >= 13 && memberMonths <= 24
  }

  // Aplica filtro de usuarios veteranos de 25+ meses.
  return memberMonths >= 25
}

// Evalua si un usuario cumple el filtro de cantidad de pedidos.
const matchesOrdersFilter = (totalOrders: number, filter: OrdersCountFilter): boolean => {
  // Retorna true para filtro general.
  if (filter === 'Todos') {
    return true
  }

  // Retorna rango para usuarios con 1 a 5 pedidos.
  if (filter === '1-5 pedidos') {
    return totalOrders >= 1 && totalOrders <= 5
  }

  // Retorna rango para usuarios con 6 a 10 pedidos.
  if (filter === '6-10 pedidos') {
    return totalOrders >= 6 && totalOrders <= 10
  }

  // Retorna usuarios con 11 pedidos o mas.
  return totalOrders >= 11
}

// Renderiza la pestaña de gestion de usuarios (solo clientes).
export default function UsersManagementTab({ initialUsers }: UsersManagementTabProps) {
  // Guarda lista local de clientes.
  const [users] = useState<ManagedUser[]>(initialUsers)
  // Controla texto de busqueda por nombre o correo.
  const [searchTerm, setSearchTerm] = useState<string>('')
  // Controla filtro activo de antiguedad del cliente.
  const [antiquityFilter, setAntiquityFilter] = useState<AntiquityFilter>('Todos')
  // Controla filtro activo de cantidad de pedidos.
  const [ordersCountFilter, setOrdersCountFilter] = useState<OrdersCountFilter>('Todos')
  // Guarda el usuario expandido para mostrar historial de pedidos.
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)

  // Calcula metricas superiores de la seccion usuarios.
  const userStats = useMemo(() => {
    // Cuenta total de usuarios cargados en la vista.
    const totalUsers = users.length
    // Cuenta total de clientes (rol unico permitido).
    const totalClients = users.filter((user) => user.role === 'Cliente').length
    // Cuenta usuarios marcados como nuevos este mes.
    const newThisMonth = users.filter((user) => user.isNewThisMonth).length

    // Retorna objeto final de metricas.
    return {
      totalUsers,
      totalClients,
      newThisMonth,
    }
  }, [users])

  // Aplica filtros de busqueda, antiguedad y cantidad de pedidos.
  const filteredUsers = useMemo(() => {
    // Normaliza busqueda para comparacion case-insensitive.
    const normalizedSearch = searchTerm.trim().toLowerCase()

    // Retorna solo clientes que cumplen todos los criterios.
    return users.filter((user) => {
      // Verifica coincidencia por nombre o correo.
      const matchBySearch =
        normalizedSearch.length === 0 ||
        user.fullName.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch)

      // Verifica si cumple filtro de antiguedad.
      const matchByAntiquity = matchesAntiquityFilter(user.memberMonths, antiquityFilter)
      // Verifica si cumple filtro de total de pedidos.
      const matchByOrders = matchesOrdersFilter(user.totalOrders, ordersCountFilter)

      // Conserva usuario si cumple todos los filtros.
      return matchBySearch && matchByAntiquity && matchByOrders
    })
  }, [users, searchTerm, antiquityFilter, ordersCountFilter])

  // Actualiza filtro de busqueda desde input.
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    // Guarda valor de busqueda actual.
    setSearchTerm(event.target.value)
  }

  // Alterna visualizacion de historial por usuario.
  const toggleUserOrders = (userId: string): void => {
    // Si el usuario ya esta abierto, lo colapsa.
    if (expandedUserId === userId) {
      setExpandedUserId(null)
      return
    }

    // Si estaba cerrado, expande su historial de pedidos.
    setExpandedUserId(userId)
  }

  // Renderiza resumen, filtros y cards de clientes.
  return (
    <section className="usersManagementTab" aria-label="Gestion de usuarios">
      <header className="usersManagementTab__header">
        <h2 className="usersManagementTab__title">Usuarios</h2>
        <p className="usersManagementTab__subtitle">{users.length} usuarios registrados</p>
      </header>

      <section className="usersManagementTab__stats" aria-label="Metricas de usuarios">
        <article className="usersStatCard">
          <p>👥 {userStats.totalUsers}</p>
          <span>Usuarios totales</span>
        </article>

        <article className="usersStatCard">
          <p>🧑 {userStats.totalClients}</p>
          <span>Clientes</span>
        </article>

        <article className="usersStatCard">
          <p>🆕 {userStats.newThisMonth}</p>
          <span>Nuevos este mes</span>
        </article>
      </section>

      <p className="usersManagementTab__policyNote">
        Esta seccion solo gestiona clientes. No se permite cambiar rol a administrador en esta
        etapa.
      </p>

      <div className="usersManagementTab__filters">
        <label className="usersManagementTab__search" htmlFor="users-search-input">
          <span aria-hidden>🔎</span>
          <input
            id="users-search-input"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar usuarios..."
          />
        </label>

        <select
          value={antiquityFilter}
          onChange={(event) => setAntiquityFilter(event.target.value as AntiquityFilter)}
          aria-label="Filtrar por antiguedad"
        >
          <option value="Todos">Todos</option>
          <option value="0-12 meses">0-12 meses</option>
          <option value="13-24 meses">13-24 meses</option>
          <option value="25+ meses">25+ meses</option>
        </select>

        <select
          value={ordersCountFilter}
          onChange={(event) => setOrdersCountFilter(event.target.value as OrdersCountFilter)}
          aria-label="Filtrar por cantidad de pedidos"
        >
          <option value="Todos">Todos</option>
          <option value="1-5 pedidos">1-5 pedidos</option>
          <option value="6-10 pedidos">6-10 pedidos</option>
          <option value="11+ pedidos">11+ pedidos</option>
        </select>
      </div>

      <div className="usersManagementTab__grid" aria-label="Listado de clientes">
        {filteredUsers.map((user) => (
          <article key={user.id} className="userCard">
            <header className="userCard__header">
              <div className="userCard__identity">
                <span className="userCard__avatar" aria-hidden>
                  {user.avatarEmoji}
                </span>

                <div>
                  <p className="userCard__name">{user.fullName}</p>
                  <p className="userCard__role">🧑 {user.role}</p>
                </div>
              </div>
            </header>

            <ul className="userCard__details">
              <li>✉️ {user.email}</li>
              <li>📞 {user.phone}</li>
              <li>📅 {user.memberSinceLabel}</li>
              <li>🧾 {user.totalOrders} pedidos</li>
            </ul>

            <div className="userCard__actions">
              <button type="button" onClick={() => toggleUserOrders(user.id)}>
                {expandedUserId === user.id ? 'Ocultar pedidos' : 'Ver pedidos'}
              </button>

              <button type="button" disabled>
                Solo cliente
              </button>
            </div>

            {expandedUserId === user.id ? (
              <div className="userCard__orders" aria-label={`Pedidos de ${user.fullName}`}>
                <p className="userCard__ordersTitle">Historial de pedidos</p>
                <ul>
                  {user.orders.map((order) => (
                    <li key={order.id}>
                      <span>{order.id}</span>
                      <span>{order.dateLabel}</span>
                      <span>{order.total}</span>
                      <span>{order.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
