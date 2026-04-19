// Importa el tipo de enlace para menu lateral del dashboard.
import type { AdminTabId, SidebarLink } from '../adminDashboard/adminDashboard.types'
// Importa el boton reutilizable para acciones de pie de sidebar.
import AppButton from '../../common/appButton/appButton'
// Importa estilos dedicados del sidebar.
import './adminSidebar.css'

// Define las propiedades del sidebar admin.
interface AdminSidebarProps {
  // Lista de secciones visibles en menu lateral.
  links: SidebarLink[]
  // Pestaña activa actualmente en el workspace admin.
  activeTab: AdminTabId
  // Callback para cambiar de pestaña desde el menu lateral.
  onSelectTab: (nextTab: AdminTabId) => void
  // Accion para ir al placeholder de cliente.
  onOpenClientPreview: () => void
  // Accion para cerrar sesion y volver al login.
  onSignOut: () => void
}

// Renderiza menu lateral principal del panel de administracion.
export default function AdminSidebar({
  links,
  activeTab,
  onSelectTab,
  onOpenClientPreview,
  onSignOut,
}: AdminSidebarProps) {
  // Dibuja estructura de marca, menu y acciones finales.
  return (
    <aside className="adminSidebar" aria-label="Panel lateral del administrador">
      <div className="adminSidebar__brand">
        <div className="adminSidebar__logo" aria-hidden>
          FF
        </div>
        <div>
          <p className="adminSidebar__name">FitFuel</p>
          <p className="adminSidebar__subtitle">Admin Panel</p>
        </div>
      </div>

      <nav className="adminSidebar__nav">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={`adminSidebar__link ${link.id === activeTab ? 'is-active' : ''}`}
            aria-current={link.id === activeTab ? 'page' : undefined}
            onClick={() => onSelectTab(link.id)}
          >
            <span className="adminSidebar__icon">{link.shortLabel}</span>
            <span className="adminSidebar__label">{link.label}</span>
            {link.badge ? <span className="adminSidebar__badge">{link.badge}</span> : null}
          </button>
        ))}
      </nav>

      <div className="adminSidebar__footer">
        <AppButton
          label="Vista Cliente"
          variant="ghost"
          onClick={onOpenClientPreview}
          fullWidth
        />
        <AppButton label="Cerrar sesion" variant="danger" onClick={onSignOut} fullWidth />
      </div>
    </aside>
  )
}
