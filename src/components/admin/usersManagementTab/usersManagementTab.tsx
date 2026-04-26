import { useState, useEffect, useMemo } from 'react'
import { listenToAllUsers } from '../../../services/firebase/users.services'
import { listenToAllOrders } from '../../../services/firebase/orders.services'
import type { UserDocument, OrderDocument } from '../../../services/firebase/types'
import './usersManagementTab.css'

type RoleFilter = 'Todos' | 'Clientes' | 'Admins'

export default function UsersManagementTab() {
  const [users, setUsers] = useState<UserDocument[]>([])
  const [orders, setOrders] = useState<OrderDocument[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('Todos')
  const [selectedUser, setSelectedUser] = useState<UserDocument | null>(null)
  const [orderFilter, setOrderFilter] = useState<'Todos' | 'En camino' | 'Entregado'>('Todos')

  useEffect(() => {
    const unsubUsers = listenToAllUsers(setUsers)
    const unsubOrders = listenToAllOrders(setOrders)
    return () => {
      unsubUsers()
      unsubOrders()
    }
  }, [])

  const userStats = useMemo(() => {
    const totalUsers = users.length
    const totalClients = users.filter(u => u.role === 'client').length
    const totalAdmins = users.filter(u => u.role === 'admin').length
    
    const now = new Date()
    const newThisMonth = users.filter(u => {
      const d = new Date(u.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    return { totalUsers, totalClients, totalAdmins, newThisMonth }
  }, [users])

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()
    return users.filter(u => {
      const matchSearch = (u.name?.toLowerCase() || '').includes(search) || u.email.toLowerCase().includes(search)
      const matchRole = roleFilter === 'Todos' || 
                        (roleFilter === 'Clientes' && u.role === 'client') || 
                        (roleFilter === 'Admins' && u.role === 'admin')
      return matchSearch && matchRole
    })
  }, [users, searchTerm, roleFilter])

  // Helper to format date "enero de 2024"
  const formatJoinDate = (isoString?: string) => {
    if (!isoString) return 'Desconocida'
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return 'Desconocida'
    const month = d.toLocaleString('es-ES', { month: 'long' })
    return `Desde ${month} de ${d.getFullYear()}`
  }
  
  const getOrderStatsForUser = (userId: string) => {
    const userOrders = orders.filter(o => o.userId === userId)
    const totalSpent = userOrders.reduce((acc, o) => acc + o.total, 0)
    const completed = userOrders.filter(o => o.status === 'delivered')
    const active = userOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
    return {
      count: userOrders.length,
      totalSpent,
      completed: completed.length,
      active: active.length,
      list: userOrders
    }
  }

  const selectedUserStats = selectedUser ? getOrderStatsForUser(selectedUser.id!) : null

  const filteredUserOrders = useMemo(() => {
    if (!selectedUserStats) return []
    if (orderFilter === 'Todos') return selectedUserStats.list
    if (orderFilter === 'En camino') return selectedUserStats.list.filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
    if (orderFilter === 'Entregado') return selectedUserStats.list.filter(o => o.status === 'delivered')
    return selectedUserStats.list
  }, [selectedUserStats, orderFilter])

  return (
    <section className="usersTab">
      <header className="usersTab__header">
        <h2 className="usersTab__title">Usuarios</h2>
        <p className="usersTab__subtitle">{userStats.totalUsers} usuarios registrados</p>
      </header>

      <div className="usersTab__statsRow">
        <div className="usersTab__statCard">
          <span className="usersTab__statIcon">👤</span>
          <div>
            <strong>{userStats.totalClients}</strong>
            <span>Clientes</span>
          </div>
        </div>
        <div className="usersTab__statCard">
          <span className="usersTab__statIcon admin">🛡️</span>
          <div>
            <strong>{userStats.totalAdmins}</strong>
            <span>Administradores</span>
          </div>
        </div>
        <div className="usersTab__statCard">
          <span className="usersTab__statIcon date">📅</span>
          <div>
            <strong>{userStats.newThisMonth}</strong>
            <span>Nuevos este mes</span>
          </div>
        </div>
      </div>

      <div className="usersTab__controls">
        <div className="usersTab__searchWrapper">
          <span className="usersTab__searchIcon">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="usersTab__search"
          />
        </div>
        <div className="usersTab__roleFilters">
          {(['Todos', 'Clientes', 'Admins'] as const).map(role => (
            <button 
              key={role} 
              className={`usersTab__roleBtn ${roleFilter === role ? 'active' : ''}`}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="usersTab__grid">
        {filteredUsers.map(user => {
          const stats = getOrderStatsForUser(user.id!)
          const isAdmin = user.role === 'admin'
          
          return (
            <article key={user.id} className="userCard">
              <div className="userCard__header">
                <div className="userCard__avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="userCard__headerInfo">
                  <h3>{user.name || 'Sin Nombre'}</h3>
                  <span className={`userCard__badge ${isAdmin ? 'admin' : 'client'}`}>
                    {isAdmin ? '🛡️ Admin' : '👤 Cliente'}
                  </span>
                </div>
              </div>
              <div className="userCard__details">
                <p>📧 {user.email}</p>
                <p>📞 {user.phone || '+52 55 0000 0000'}</p>
                <p>📅 {formatJoinDate(user.createdAt)}</p>
              </div>
              <div className="userCard__metrics">
                <div className="userCard__metricItem light-green">
                  <strong>{stats.count}</strong>
                  <span>pedidos</span>
                </div>
                <div className="userCard__metricItem light-blue">
                  <strong>${stats.totalSpent.toLocaleString('en-US')}</strong>
                  <span>gastados</span>
                </div>
              </div>
              <button 
                className="userCard__actionBtn"
                onClick={() => setSelectedUser(user)}
              >
                Ver pedidos {stats.count > 0 ? ` ${stats.count}` : ''} ›
              </button>
            </article>
          )
        })}
        {filteredUsers.length === 0 && (
          <p className="usersTab__empty">No se encontraron usuarios.</p>
        )}
      </div>

      {/* Sidebar for User Orders */}
      {selectedUser && (
        <div className="userSidebar__overlay" onClick={() => setSelectedUser(null)}>
          <aside className="userSidebar" onClick={(e) => e.stopPropagation()}>
            <header className="userSidebar__header">
              <div className="userSidebar__headerProfile">
                <div className="userCard__avatar">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3>{selectedUser.name || 'Sin Nombre'}</h3>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
              <button className="userSidebar__close" onClick={() => setSelectedUser(null)}>✖</button>
            </header>

            {selectedUserStats && (
              <>
                <div className="userSidebar__statsGrid">
                  <div className="userSidebar__statBox light-green">
                    <span className="icon">💲</span>
                    <strong>${selectedUserStats.totalSpent.toLocaleString('en-US')}</strong>
                    <span>Total gastado</span>
                  </div>
                  <div className="userSidebar__statBox light-blue">
                    <span className="icon">⏱️</span>
                    <strong>{selectedUserStats.completed} pedidos</strong>
                    <span>Completados</span>
                  </div>
                  <div className="userSidebar__statBox light-orange">
                    <span className="icon">🔄</span>
                    <strong>{selectedUserStats.active} activo</strong>
                    <span>En curso</span>
                  </div>
                </div>

                <div className="userSidebar__orderFilters">
                  {(['Todos', 'En camino', 'Entregado'] as const).map(f => {
                    const count = f === 'Todos' ? selectedUserStats.count : 
                                  f === 'En camino' ? selectedUserStats.active : selectedUserStats.completed;
                    const isActive = orderFilter === f;
                    const suffix = f === 'En camino' ? '🛵' : f === 'Entregado' ? '✔️' : '';
                    return (
                      <button 
                         key={f}
                         className={`userSidebar__filterBtn ${isActive ? 'active' : ''}`}
                         onClick={() => setOrderFilter(f)}
                      >
                        {suffix} {f} ({count})
                      </button>
                    )
                  })}
                </div>

                <div className="userSidebar__orderList">
                  {filteredUserOrders.map(order => {
                    const totalItems = order.items.reduce((s,i) => s + i.quantity, 0)
                    const dateStr = new Date(order.createdAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
                    const isDelivered = order.status === 'delivered'
                    return (
                      <div key={order.id} className="userSidebar__orderCard">
                        <div className="userSidebar__orderCardIcon">
                          {isDelivered ? '✔️' : '🛵'}
                        </div>
                        <div className="userSidebar__orderCardInfo">
                          <div className="userSidebar__orderCardHead">
                            <strong>{order.id?.slice(0, 8)}...</strong>
                            <span className={`userSidebar__statusBadge ${isDelivered ? 'delivered' : 'active'}`}>
                              {isDelivered ? 'Entregado' : 'En camino'}
                            </span>
                          </div>
                          <p className="userSidebar__orderCardMeta">
                            {dateStr} • {totalItems} platos
                          </p>
                        </div>
                        <div className="userSidebar__orderCardPrice">
                          ${order.total.toLocaleString('en-US')} 
                          <span className="chev">⌄</span>
                        </div>
                      </div>
                    )
                  })}
                  {filteredUserOrders.length === 0 && (
                    <p className="userSidebar__empty">No hay pedidos en esta categoría.</p>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </section>
  )
}
