import { useState } from 'react'
import type { ClientAccountViewProps } from './clientAccountView.types'
import './clientAccountView.css'

export default function ClientAccountView({ onNavigateToMenu, onLogout }: ClientAccountViewProps) {
  // Estado para controlar si el usuario está en modo edicion.
  const [isEditing, setIsEditing] = useState<boolean>(true)

  // Datos mock del usuario
  const [userData, setUserData] = useState({
    name: 'Sara López',
    email: 'admin@fitfuel.com',
    phone: '+52 55 9876 5432',
  })

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
            <span className="clientAccountHistory__count">0 pedidos</span>
          </header>
          
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