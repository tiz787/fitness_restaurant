import { useState, useEffect } from 'react'
import type { ClientAccountViewProps } from './clientAccountView.types'
import { listenToUserOrders } from '../../../services/firebase/orders.services'
import type { OrderDocument } from '../../../services/firebase/types'
import { auth } from '../../../services/firebase/config'
import './clientAccountView.css'

export default function ClientAccountView({ onNavigateToMenu, onLogout }: ClientAccountViewProps) {
  // Estado para controlar si el usuario está en modo edicion.
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Datos del usuario real de Firebase Auth
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '', // Aquí podríamos mapear desde un perfil en firestore, por ahora usaremos displayName si existe.
  })

  const [orders, setOrders] = useState<OrderDocument[]>([])

  useEffect(() => {
    const defaultUser = auth.currentUser;
    if (defaultUser) {
      setUserData({
        name: defaultUser.displayName || 'Cliente Demo',
        email: defaultUser.email || '',
        phone: defaultUser.phoneNumber || '+00 0000 0000',
      })
    }
  }, [])

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Escuchar órdenes del usuario actual real en la base de datos
    const unsubscribe = listenToUserOrders(userId, (userOrders) => {
      setOrders(userOrders);
    });
    return () => unsubscribe();
  }, []);

  // Funciones para manejar los cambios en el formulario
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault()
    setIsEditing(false)
  }

  return (
    <div className="clientAccountView">
      <div className="clientAccountView__container">
        
        {/* TARJETA DE PERFIL Y FORMULARIO */}
        <section className="clientAccountCard clientAccountCard--profile">
          <header className="clientAccountCard__header">
            <div className="clientAccountProfile__info">
              <div className="clientAccountProfile__avatar" aria-hidden="true">
                🧑🏽
              </div>
              <div className="clientAccountProfile__details">
                <h2>{userData.name}</h2>
                <p>{userData.email}</p>
                <div className="clientAccountProfile__badge">
                  <span aria-hidden="true">✓</span> Cliente activo
                </div>
              </div>
            </div>
            
            <button
              type="button"
              className={`clientAccountProfile__toggleBtn ${isEditing ? 'is-editing' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <span aria-hidden="true">✍️</span> Cancelar
                </>
              ) : (
                <>
                  <span aria-hidden="true">✏️</span> Editar
                </>
              )}
            </button>
          </header>

          <form className="clientAccountProfile__form" onSubmit={handleSave}>
            <div className="clientAccountProfile__formGroup">
              <label htmlFor="input-name">Nombre</label>
              <input
                id="input-name"
                name="name"
                type="text"
                value={userData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="clientAccountProfile__formGroup">
              <label htmlFor="input-email">Correo</label>
              <input
                id="input-email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="clientAccountProfile__formGroup">
              <label htmlFor="input-phone">Teléfono</label>
              <input
                id="input-phone"
                name="phone"
                type="tel"
                value={userData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <button type="submit" className="clientAccountProfile__saveBtn">
                <span aria-hidden="true">💾</span> Guardar
              </button>
            )}
          </form>
        </section>

        {/* TARJETA DE HISTORIAL DE PEDIDOS */}
        <section className="clientAccountCard clientAccountCard--history">
          <header className="clientAccountHistory__header">
            <h2>
              <span aria-hidden="true">📦</span> Historial de pedidos
            </h2>
            <span className="clientAccountHistory__count">{orders.length} pedidos</span>
          </header>
          
          {orders.length === 0 ? (
            <div className="clientAccountHistory__emptyState">
              <div className="clientAccountHistory__emptyIcon" aria-hidden="true">🛍️</div>
              <p>Aún no tienes pedidos</p>
              <button
                type="button"
                className="clientAccountHistory__menuBtn"
                onClick={onNavigateToMenu}
              >
                Ver menú
              </button>
            </div>
          ) : (
            <div className="clientAccountHistory__list">
              {orders.map((order) => {
                let statusLabel = 'Recibido';
                let statusColor = '#3498db';
                if (order.status === 'preparing') { statusLabel = 'Preparando'; statusColor = '#f39c12'; }
                if (order.status === 'ready') { statusLabel = 'Listo'; statusColor = '#9b59b6'; }
                if (order.status === 'delivered') { statusLabel = 'Entregado'; statusColor = '#2ecc71'; }
                if (order.status === 'cancelled') { statusLabel = 'Cancelado'; statusColor = '#e74c3c'; }

                let dateObj = new Date();
                if (order.createdAt) {
                  const createdAtTyped = order.createdAt as unknown as { toDate?: () => Date };
                  if (typeof createdAtTyped.toDate === 'function') {
                    dateObj = createdAtTyped.toDate();
                  } else if (typeof order.createdAt === 'string' || typeof order.createdAt === 'number') {
                    dateObj = new Date(order.createdAt);
                  }
                }
                const dateStr = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('es-CO', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'});

                return (
                  <div key={order.id} className="clientAccountHistory__item" style={{ borderBottom: '1px solid #eee', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Pedido #{order.id?.substring(0, 6)}</p>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>{dateStr}</p>
                      <p style={{ fontSize: '0.9rem', color: '#333' }}>
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                      <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        COP {order.total.toLocaleString('es-CO')}
                      </p>
                    </div>
                    <div>
                      <span style={{ 
                        backgroundColor: statusColor, 
                        color: 'white', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold' 
                      }}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* CERRAR SESIÓN */}
        <button
          type="button"
          className="clientAccountView__logoutBtn"
          onClick={onLogout}
        >
          <span aria-hidden="true">🚪</span> Cerrar sesión
        </button>

      </div>
    </div>
  )
}