// Importa el hook de estado para controlar la vista actual.
import { useState } from 'react'
// Importa los estilos generales de la aplicacion.
import './App.css'
// Importa el formulario de acceso por roles.
import AccessSwitcherForm from './components/auth/accessSwitcherForm/accessSwitcherForm'
// Importa la vista principal del panel admin.
import AdminDashboard from './components/admin/adminDashboard/adminDashboard'
// Importa la vista principal inicial de cliente basada en catalogo.
import ClientMenuView from './components/client/clientMenuView/clientMenuView'
// Importa el tipo de datos del formulario de acceso.
import type { AccessFormValues } from './components/auth/accessSwitcherForm/accessSwitcherForm.types'

// Define las vistas posibles de la aplicacion en esta primera etapa.
type AppView = 'access' | 'admin' | 'client-placeholder'

// Componente raiz de la aplicacion.
function App() {
  // Guarda la vista actual para alternar entre acceso, admin y cliente temporal.
  const [currentView, setCurrentView] = useState<AppView>('access')
  // Guarda el correo del admin para mostrarlo en el panel.
  const [activeAdminEmail, setActiveAdminEmail] = useState<string>('admin@fitfuel.com')

  // Maneja el envio del formulario admin y cambia la vista al dashboard.
  const handleEnterAdmin = (values: AccessFormValues): void => {
    // Si no hay email escrito, deja un email por defecto para la demo visual.
    const nextEmail = values.email.trim() || 'admin@fitfuel.com'
    // Actualiza el email que se muestra en cabecera del panel.
    setActiveAdminEmail(nextEmail)
    // Navega a la vista de administrador.
    setCurrentView('admin')
  }

  // Cambia a la vista temporal del cliente (sin logica de negocio aun).
  const handleEnterClientPlaceholder = (): void => {
    // Muestra la pantalla de "proximamente" para cliente.
    setCurrentView('client-placeholder')
  }

  // Regresa a la pantalla de acceso para cambiar de rol.
  const handleBackToAccess = (): void => {
    // Reestablece la vista de seleccion de rol.
    setCurrentView('access')
  }

  // Renderiza el layout base y decide que vista mostrar.
  return (
    <div
      className={`appRoot ${currentView === 'admin' ? 'appRoot--admin' : ''} ${currentView === 'client-placeholder' ? 'appRoot--client' : ''}`}
    >
      {currentView === 'access' ? (
        <div className="appCenterPanel">
          <AccessSwitcherForm
            onEnterAdmin={handleEnterAdmin}
            onEnterClient={handleEnterClientPlaceholder}
          />
        </div>
      ) : null}

      {currentView === 'admin' ? (
        <AdminDashboard
          adminEmail={activeAdminEmail}
          onSignOut={handleBackToAccess}
          onOpenClientPreview={handleEnterClientPlaceholder}
        />
      ) : null}

      {currentView === 'client-placeholder' ? (
        <ClientMenuView onBackToAccess={handleBackToAccess} />
      ) : null}
    </div>
  )
}

// Exporta el componente para usarlo en el punto de entrada.
export default App
