import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './services/firebase/config'
import { signOutCurrentSession } from './services/firebase/auth.services'
import './App.css'
import AccessSwitcherForm from './components/auth/accessSwitcherForm/accessSwitcherForm'
import AdminDashboard from './components/admin/adminDashboard/adminDashboard'
import ClientMenuView from './components/client/clientMenuView/clientMenuView'

type AppView = 'access' | 'admin' | 'client-placeholder' | 'role-selector'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('access')
  const [activeAdminEmail, setActiveAdminEmail] = useState<string>('admin@fitfuel.com')
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSessionUser(user)
      if (user) {
        setActiveAdminEmail(user.email || 'admin@fitfuel.com')
        // Si hay usuario y estábamos en login, pasamos al selector de rol
        if (currentView === 'access') {
          setCurrentView('role-selector')
        }
      } else {
        // Ningún usuario autenticado
        setCurrentView('access')
      }
      setLoadingAuth(false)
    })
    return () => unsubscribe()
  }, [currentView])

  const handleEnterAdmin = (): void => {
    setCurrentView('admin')
  }

  const handleEnterClientPlaceholder = (): void => {
    setCurrentView('client-placeholder')
  }

  const handleSignOut = async (): Promise<void> => {
    await signOutCurrentSession()
  }

  // Permite volver al selector desde otra vista
  const handleBackToSelector = (): void => {
    setCurrentView('role-selector')
  }

  if (loadingAuth) {
    return <div className="appRoot appRoot--loading">Cargando...</div>
  }

  return (
    <div
      className={`appRoot ${currentView === 'admin' ? 'appRoot--admin' : ''} ${currentView === 'client-placeholder' ? 'appRoot--client' : ''} ${currentView === 'access' ? 'appRoot--access' : ''} ${currentView === 'role-selector' ? 'appRoot--selector' : ''}`}
    >
      {currentView === 'access' ? (
        <AccessSwitcherForm
          onEnterAdmin={() => { /* Navigation unnecesary here since auth state change redirects */ }}
          onEnterClient={() => { /* Same */ }}
        />
      ) : null}

      {currentView === 'role-selector' ? (
        <div className="roleSelectorContainer">
          <header className="roleSelector__header">
            <h1>Bienvenido a tu Sandbox, {sessionUser?.displayName || sessionUser?.email}</h1>
            <p>Este es tu propio espacio aislado. Puedes simular ser cliente y luego entrar como admin para ver los cambios.</p>
          </header>
          <div className="roleSelector__cards">
            <div className="roleCard roleCard--client">
              <h3>Modo Cliente</h3>
              <p>Simula compras, explora tu menú semilla y haz pedidos de prueba.</p>
              <button onClick={handleEnterClientPlaceholder}>Entrar como Cliente</button>
            </div>
            <div className="roleCard roleCard--admin">
              <h3>Modo Administrador</h3>
              <p>Gestiona tu menú, revisa las órdenes de tus clientes (las que hiciste) y crea promociones.</p>
              <button onClick={handleEnterAdmin}>Entrar como Admin</button>
            </div>
          </div>
          <div className="roleSelector__footer">
             <button className="signOutBtn" onClick={handleSignOut}>Cerrar Sesión</button>
          </div>
        </div>
      ) : null}

      {currentView === 'admin' ? (
        // Modificado para que "onSignOut" simplemente vuelva al selector
        // y le damos una nueva prop de "closeSession" si se requiere.
        <AdminDashboard
          adminEmail={activeAdminEmail}
          onSignOut={handleBackToSelector}
          onOpenClientPreview={handleEnterClientPlaceholder}
        />
      ) : null}

      {currentView === 'client-placeholder' ? (
        // Añadimos prop de retroceso para volver al selector de este lado también
        <ClientMenuView onBackToAccess={handleBackToSelector} />
      ) : null}
    </div>
  )
}

export default App
