// Importa estado local para controlar la pestaña activa del admin.
import { useState } from 'react'
// Importa tipos para validar el contrato de entrada del dashboard.
import type { AdminDashboardProps, AdminTabId } from './adminDashboard.types'
// Importa datos estaticos para renderizar la UI sin backend por ahora.
import {
  activeOrdersData,
  adminTabLabels,
  categoryDistributionData,
  dashboardMetrics,
  managedOrdersData,
  managedUsersData,
  menuDishesData,
  menuFilterCategories,
  promotionCouponsData,
  reportCustomPerformanceSeedData,
  reportPresetData,
  salesTrendData,
  sidebarLinks,
  systemAlertsData,
  topDishesData,
} from '../../../data/adminDashboard.data'
// Importa subcomponentes de cada modulo visual del panel.
import AdminSidebar from '../adminSidebar/adminSidebar'
import MetricCard from '../metricCard/metricCard'
import SalesTrendPanel from '../salesTrendPanel/salesTrendPanel'
import CategorySalesPanel from '../categorySalesPanel/categorySalesPanel'
import ActiveOrdersPanel from '../activeOrdersPanel/activeOrdersPanel'
import TopDishesPanel from '../topDishesPanel/topDishesPanel'
import SystemAlertsPanel from '../systemAlertsPanel/systemAlertsPanel'
import OrdersManagementTab from '../ordersManagementTab/ordersManagementTab'
import MenuManagementTab from '../menuManagementTab/menuManagementTab'
import PromotionsManagementTab from '../promotionsManagementTab/promotionsManagementTab'
import ReportsManagementTab from '../reportsManagementTab/reportsManagementTab'
import UsersManagementTab from '../usersManagementTab/usersManagementTab'
// Importa estilos globales del layout admin.
import './adminDashboard.css'

// Renderiza la vista principal del administrador para gestionar operacion diaria.
export default function AdminDashboard({
  adminEmail,
  onSignOut,
  onOpenClientPreview,
}: AdminDashboardProps) {
  // Controla la pestaña activa del panel para renderizar su contenido.
  const [activeTab, setActiveTab] = useState<AdminTabId>('dashboard')
  // Obtiene titulo y subtitulo de la pestaña actual.
  const activeTabLabel = adminTabLabels[activeTab]

  // Renderiza contenido segun pestaña seleccionada en sidebar.
  const renderActiveTabContent = () => {
    // Si la pestaña activa es dashboard, muestra la vista principal analitica.
    if (activeTab === 'dashboard') {
      return (
        <>
          <section className="adminMetricsGrid" aria-label="Metricas principales">
            {dashboardMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </section>

          <section className="adminAnalyticsGrid" aria-label="Analitica de ventas">
            <SalesTrendPanel points={salesTrendData} />
            <CategorySalesPanel categories={categoryDistributionData} />
          </section>

          <section className="adminOperationsGrid" aria-label="Operacion en tiempo real">
            <ActiveOrdersPanel orders={activeOrdersData} />
            <TopDishesPanel dishes={topDishesData} />
          </section>

          <SystemAlertsPanel alerts={systemAlertsData} />
        </>
      )
    }

    // Si la pestaña activa es pedidos, muestra gestion completa de ordenes.
    if (activeTab === 'pedidos') {
      return <OrdersManagementTab orders={managedOrdersData} />
    }

    // Si la pestaña activa es menu, muestra gestion de platos con filtros.
    if (activeTab === 'menu') {
      return <MenuManagementTab initialDishes={menuDishesData} categories={menuFilterCategories} />
    }

    // Si la pestaña activa es promociones, muestra cupones y condiciones.
    if (activeTab === 'promociones') {
      return <PromotionsManagementTab initialCoupons={promotionCouponsData} />
    }

    // Si la pestaña activa es usuarios, muestra gestion de clientes y pedidos.
    if (activeTab === 'usuarios') {
      return <UsersManagementTab initialUsers={managedUsersData} />
    }

    // Si la pestaña activa es reportes, muestra analitica con filtros por periodo.
    if (activeTab === 'reportes') {
      return (
        <ReportsManagementTab
          presetData={reportPresetData}
          customSeedData={reportCustomPerformanceSeedData}
        />
      )
    }

    // Renderiza placeholder para modulos que construiremos despues.
    return (
      <section className="adminPlaceholderCard panelCard" aria-label="Modulo en construccion">
        <h2 className="panelCard__title">{activeTabLabel.title}</h2>
        <p className="adminPlaceholderCard__text">
          Este modulo se implementara en el siguiente paso. La estructura ya esta preparada para
          conectar datos reales con Firebase.
        </p>
      </section>
    )
  }

  // Dibuja estructura completa: sidebar, topbar, KPIs, paneles y alertas.
  return (
    <div className="adminDashboardLayout">
      <AdminSidebar
        links={sidebarLinks}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSignOut={onSignOut}
        onOpenClientPreview={onOpenClientPreview}
      />

      <div className="adminWorkspace">
        <header className="adminTopbar">
          <div>
            <h1 className="adminTopbar__title">{activeTabLabel.title}</h1>
            <p className="adminTopbar__subtitle">{activeTabLabel.subtitle}</p>
          </div>

          <div className="adminTopbar__profile">
            <span className="adminTopbar__status">En linea</span>
            <span className="adminTopbar__avatar" aria-hidden>
              SL
            </span>
            <div>
              <p className="adminTopbar__name">Sara Lopez</p>
              <p className="adminTopbar__role">{adminEmail}</p>
            </div>
          </div>
        </header>

        <main className={`adminMain ${activeTab !== 'dashboard' ? 'adminMain--single' : ''}`}>
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  )
}
