// Importa estado local para controlar la pestaña activa del admin.
import { useEffect, useMemo, useState } from 'react'
// Firebase real-time services
import { listenToAllOrders } from '../../../services/firebase/orders.services'
import { listenToAllProducts } from '../../../services/firebase/products.services'
import { auth } from '../../../services/firebase/config'
// Importa tipos para validar el contrato de entrada del dashboard.
import type {
  ActiveOrder,
  AdminDashboardProps,
  AdminTabId,
  CategoryDistribution,
  DashboardMetric,
  SalesTrendPoint,
  SystemAlert,
  TopDish,
} from './adminDashboard.types'
import type { OrderDocument, ProductDocument } from '../../../services/firebase/types'
// Importa datos estaticos para renderizar la UI sin backend por ahora.
import {
  adminTabLabels,
  menuFilterCategories,
  sidebarLinks,
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

type DashboardRangePreset = 'today' | '7d' | '30d'

interface DashboardRangeData {
  start: Date
  end: Date
  previousStart: Date
  previousEnd: Date
  useHourlySeries: boolean
  label: string
}

const formatCurrencyCOP = (value: number): string =>
  `COP ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(
    Math.max(0, Math.round(value)),
  )}`

const toDayKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toDayLabel = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

const formatSignedPercentage = (currentValue: number, previousValue: number): string => {
  if (previousValue <= 0 && currentValue > 0) return '+100%'
  if (previousValue <= 0) return '0%'

  const change = ((currentValue - previousValue) / previousValue) * 100
  const rounded = Math.round(change)
  return `${rounded > 0 ? '+' : ''}${rounded}%`
}

const resolveISOOrTimestamp = (dateVal: unknown): Date | null => {
  if (!dateVal) return null

  if (typeof dateVal === 'object' && dateVal !== null) {
    const maybeTimestamp = dateVal as { seconds?: number; toDate?: () => Date }
    if (typeof maybeTimestamp.toDate === 'function') {
      const dateResult = maybeTimestamp.toDate()
      return Number.isNaN(dateResult.getTime()) ? null : dateResult
    }
    if (typeof maybeTimestamp.seconds === 'number') {
      const dateResult = new Date(maybeTimestamp.seconds * 1000)
      return Number.isNaN(dateResult.getTime()) ? null : dateResult
    }
  }

  const parsed = new Date(String(dateVal))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const resolveDashboardRange = (preset: DashboardRangePreset): DashboardRangeData => {
  const now = new Date()
  const currentDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const currentDayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

  if (preset === 'today') {
    const previousStart = new Date(currentDayStart)
    previousStart.setDate(previousStart.getDate() - 1)
    const previousEnd = new Date(currentDayEnd)
    previousEnd.setDate(previousEnd.getDate() - 1)

    return {
      start: currentDayStart,
      end: currentDayEnd,
      previousStart,
      previousEnd,
      useHourlySeries: true,
      label: 'Hoy',
    }
  }

  const windowDays = preset === '7d' ? 7 : 30
  const start = new Date(currentDayStart)
  start.setDate(start.getDate() - (windowDays - 1))

  const previousEnd = new Date(start.getTime() - 1)
  const previousStart = new Date(previousEnd)
  previousStart.setDate(previousStart.getDate() - (windowDays - 1))

  return {
    start,
    end: currentDayEnd,
    previousStart,
    previousEnd,
    useHourlySeries: false,
    label: preset === '7d' ? 'Ultimos 7 dias' : 'Ultimos 30 dias',
  }
}

// Renderiza la vista principal del administrador para gestionar operacion diaria.
export default function AdminDashboard({
  adminEmail,
  onSignOut,
  onOpenClientPreview,
}: AdminDashboardProps) {
  // Controla la Pestaña Activa
  const [activeTab, setActiveTab] = useState<AdminTabId>('dashboard')
  const [dashboardRange, setDashboardRange] = useState<DashboardRangePreset>('7d')
  // Obtiene titulo y subtitulo de la pestaña actual.
  const activeTabLabel = adminTabLabels[activeTab]

  const [orders, setOrders] = useState<OrderDocument[]>([])
  const [products, setProducts] = useState<ProductDocument[]>([])

  // Suscripción a streams de Firebase para dashboard dinámico.
  useEffect(() => {
    const unsubscribeOrders = listenToAllOrders(setOrders)
    const unsubscribeProducts = listenToAllProducts(setProducts)

    return () => {
      unsubscribeOrders()
      unsubscribeProducts()
    }
  }, [])

  const normalizedOrders = useMemo(() => {
    return orders
      .map((order) => ({
        order,
        createdAt: resolveISOOrTimestamp(order.createdAt),
      }))
      .filter((entry): entry is { order: OrderDocument; createdAt: Date } => {
        return Boolean(entry.createdAt) && entry.order.status !== 'cancelled'
      })
  }, [orders])

  const dashboardRangeData = useMemo(() => resolveDashboardRange(dashboardRange), [dashboardRange])

  const currentRangeOrders = useMemo(() => {
    return normalizedOrders.filter(({ createdAt }) => {
      return createdAt >= dashboardRangeData.start && createdAt <= dashboardRangeData.end
    })
  }, [normalizedOrders, dashboardRangeData])

  const previousRangeOrders = useMemo(() => {
    return normalizedOrders.filter(({ createdAt }) => {
      return createdAt >= dashboardRangeData.previousStart && createdAt <= dashboardRangeData.previousEnd
    })
  }, [normalizedOrders, dashboardRangeData])

  const realTimeOrders = useMemo<ActiveOrder[]>(() => {
    return normalizedOrders
      .filter(({ order }) => order.status !== 'delivered')
      .map(({ order }) => {
        const itemsCount = order.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0

        let uiStatus: ActiveOrder['status'] = 'Recibido'
        if (order.status === 'preparing') uiStatus = 'Preparando'
        if (order.status === 'ready') uiStatus = 'En camino'

        return {
          id: order.id || 'N/A',
          customer: order.userId || 'Cliente',
          items: itemsCount,
          total: formatCurrencyCOP(order.total),
          status: uiStatus,
        }
      })
      .slice(0, 6)
  }, [normalizedOrders])

  const dashboardMetrics = useMemo<DashboardMetric[]>(() => {
    const currentRevenue = currentRangeOrders.reduce((acc, entry) => acc + entry.order.total, 0)
    const previousRevenue = previousRangeOrders.reduce((acc, entry) => acc + entry.order.total, 0)
    const currentCount = currentRangeOrders.length
    const previousCount = previousRangeOrders.length
    const currentTicket = currentCount > 0 ? currentRevenue / currentCount : 0
    const previousTicket = previousCount > 0 ? previousRevenue / previousCount : 0
    const activeCount = normalizedOrders.filter(({ order }) => order.status !== 'delivered').length

    return [
      {
        id: 'ventas',
        icon: 'COP',
        value: formatCurrencyCOP(currentRevenue),
        label: 'Ingresos',
        badge: formatSignedPercentage(currentRevenue, previousRevenue),
        tone: currentRevenue >= previousRevenue ? 'success' : 'warning',
      },
      {
        id: 'pedidos',
        icon: '[]',
        value: String(currentCount),
        label: 'Pedidos',
        badge: formatSignedPercentage(currentCount, previousCount),
        tone: currentCount >= previousCount ? 'info' : 'warning',
      },
      {
        id: 'ticket',
        icon: '->',
        value: formatCurrencyCOP(currentTicket),
        label: 'Ticket promedio',
        badge: formatSignedPercentage(currentTicket, previousTicket),
        tone: currentTicket >= previousTicket ? 'warning' : 'neutral',
      },
      {
        id: 'activos',
        icon: 'CL',
        value: String(activeCount),
        label: 'Pedidos activos',
        badge: `${activeCount} en proceso`,
        tone: 'neutral',
      },
    ]
  }, [currentRangeOrders, previousRangeOrders, normalizedOrders])

  const salesTrendData = useMemo<SalesTrendPoint[]>(() => {
    if (dashboardRangeData.useHourlySeries) {
      const revenueByHour: Record<number, number> = {}

      currentRangeOrders.forEach(({ order, createdAt }) => {
        const hour = createdAt.getHours()
        revenueByHour[hour] = (revenueByHour[hour] || 0) + order.total
      })

      return Array.from({ length: 24 }).map((_, hour) => ({
        day: `${String(hour).padStart(2, '0')}:00`,
        amount: revenueByHour[hour] || 0,
      }))
    }

    const revenueByDay: Record<string, number> = {}
    currentRangeOrders.forEach(({ order, createdAt }) => {
      const dayKey = toDayKey(createdAt)
      revenueByDay[dayKey] = (revenueByDay[dayKey] || 0) + order.total
    })

    const points: SalesTrendPoint[] = []
    const cursor = new Date(dashboardRangeData.start)
    while (cursor <= dashboardRangeData.end) {
      const dayKey = toDayKey(cursor)
      points.push({
        day: toDayLabel(cursor),
        amount: revenueByDay[dayKey] || 0,
      })
      cursor.setDate(cursor.getDate() + 1)
    }

    return points
  }, [currentRangeOrders, dashboardRangeData])

  const categoryDistributionData = useMemo<CategoryDistribution[]>(() => {
    const productCategoryById = new Map<string, string>()
    products.forEach((product) => {
      if (product.id) productCategoryById.set(product.id, product.category || 'Otros')
    })

    const categoryRevenue: Record<string, number> = {}

    currentRangeOrders.forEach(({ order }) => {
      order.items.forEach((item) => {
        const categoryName = productCategoryById.get(item.productId) || 'Otros'
        categoryRevenue[categoryName] = (categoryRevenue[categoryName] || 0) + item.totalPrice
      })
    })

    const categoriesSorted = Object.entries(categoryRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const totalRevenue = categoriesSorted.reduce((acc, [, revenue]) => acc + revenue, 0)
    if (totalRevenue <= 0) return []

    const colors = ['#4ba95c', '#72c780', '#9ce5a6', '#d0f4d5', '#f2a456']

    return categoriesSorted.map(([categoryName, revenue], index) => ({
      id: `cat-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
      label: categoryName,
      percentage: Number(((revenue / totalRevenue) * 100).toFixed(1)),
      color: colors[index % colors.length],
    }))
  }, [currentRangeOrders, products])

  const topDishesData = useMemo<TopDish[]>(() => {
    const dishesMap: Record<string, { id: string; name: string; orders: number; revenue: number }> = {}

    currentRangeOrders.forEach(({ order }) => {
      order.items.forEach((item) => {
        const itemId = item.productId || item.name
        if (!dishesMap[itemId]) {
          dishesMap[itemId] = {
            id: itemId,
            name: item.name,
            orders: 0,
            revenue: 0,
          }
        }

        dishesMap[itemId].orders += item.quantity
        dishesMap[itemId].revenue += item.totalPrice
      })
    })

    return Object.values(dishesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((dish) => ({
        id: dish.id,
        name: dish.name,
        orders: dish.orders,
        revenue: formatCurrencyCOP(dish.revenue),
      }))
  }, [currentRangeOrders])

  const systemAlertsData = useMemo<SystemAlert[]>(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    const cancelledToday = orders.reduce((accumulator, order) => {
      const createdAt = resolveISOOrTimestamp(order.createdAt)
      if (!createdAt) return accumulator
      if (order.status !== 'cancelled') return accumulator
      if (createdAt < todayStart || createdAt > todayEnd) return accumulator
      return accumulator + 1
    }, 0)
    const readyToDeliver = normalizedOrders.filter(({ order }) => order.status === 'ready').length
    const inactiveProducts = products.filter((product) => !product.isActive).length

    const alerts: SystemAlert[] = []

    if (readyToDeliver > 0) {
      alerts.push({
        id: 'ready-orders',
        message: `Hay ${readyToDeliver} pedido(s) listos para entregar o retirar.`,
      })
    }

    if (cancelledToday > 0) {
      alerts.push({
        id: 'cancelled-orders',
        message: `Se registraron ${cancelledToday} pedido(s) cancelados hoy.`,
      })
    }

    if (inactiveProducts > 0) {
      alerts.push({
        id: 'inactive-products',
        message: `Hay ${inactiveProducts} producto(s) inactivos en el menu.`,
      })
    }

    if (alerts.length === 0) {
      alerts.push({
        id: 'stable-ops',
        message: 'Operacion estable: no hay alertas criticas en este momento.',
      })
    }

    return alerts.slice(0, 3)
  }, [normalizedOrders, orders, products])


  // Nombre dinámico del admin autenticado
  const adminDisplayName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Administrador'
  const adminInitials = adminDisplayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  // Conteo de pedidos activos (no entregados ni cancelados) para el badge del sidebar
  const activeOrdersCount = normalizedOrders.filter(({ order }) => order.status !== 'delivered' && order.status !== 'cancelled').length
  const dynamicSidebarLinks = sidebarLinks.map((link) =>
    link.id === 'pedidos'
      ? { ...link, badge: String(activeOrdersCount) }
      : link,
  )

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
            <SalesTrendPanel points={salesTrendData} chipLabel={dashboardRangeData.label} />
            <CategorySalesPanel categories={categoryDistributionData} />
          </section>

          <section className="adminOperationsGrid" aria-label="Operacion en tiempo real">
            <ActiveOrdersPanel orders={realTimeOrders} />
            <TopDishesPanel dishes={topDishesData} />
          </section>

          <SystemAlertsPanel alerts={systemAlertsData} />
        </>
      )
    }

    // Si la pestaña activa es pedidos, muestra gestion completa de ordenes con datos reales.
    if (activeTab === 'pedidos') {
      return <OrdersManagementTab />
    }

    // Si la pestaña activa es menu, muestra gestion de platos con filtros y datos reales.
    if (activeTab === 'menu') {
      return <MenuManagementTab categories={menuFilterCategories} />
    }

    // Si la pestaña activa es promociones, muestra cupones y condiciones.
    if (activeTab === 'promociones') {
      return <PromotionsManagementTab />
    }

    // Si la pestaña activa es usuarios, muestra gestion de clientes y pedidos.
    if (activeTab === 'usuarios') {
      return <UsersManagementTab />
    }

    // Si la pestaña activa es reportes, muestra analitica con filtros por periodo.
    if (activeTab === 'reportes') {
      return <ReportsManagementTab />
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
        links={dynamicSidebarLinks}
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
            {activeTab === 'dashboard' && (
              <div className="adminTopbar__dashboardFilters" aria-label="Filtro global del dashboard">
                <button
                  type="button"
                  className={`adminTopbar__dashboardFilterBtn ${dashboardRange === 'today' ? 'is-active' : ''}`}
                  onClick={() => setDashboardRange('today')}
                >
                  Hoy
                </button>
                <button
                  type="button"
                  className={`adminTopbar__dashboardFilterBtn ${dashboardRange === '7d' ? 'is-active' : ''}`}
                  onClick={() => setDashboardRange('7d')}
                >
                  7 dias
                </button>
                <button
                  type="button"
                  className={`adminTopbar__dashboardFilterBtn ${dashboardRange === '30d' ? 'is-active' : ''}`}
                  onClick={() => setDashboardRange('30d')}
                >
                  30 dias
                </button>
              </div>
            )}
          </div>

          <div className="adminTopbar__profile">
            <span className="adminTopbar__status">En linea</span>
            <span className="adminTopbar__avatar" aria-hidden>
              {adminInitials}
            </span>
            <div>
              <p className="adminTopbar__name">{adminDisplayName}</p>
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
