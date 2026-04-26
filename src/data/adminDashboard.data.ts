// Importa tipos compartidos para tipar todos los datos estaticos.
import type {
  ActiveOrder,
  AdminTabId,
  CategoryPerformanceData,
  CategoryDistribution,
  DashboardMetric,
  DailyOrdersData,
  DailyRevenueData,
  ManagedOrder,
  ManagedUser,
  MenuDish,
  MenuFilterCategory,
  PeakHourData,
  PromotionCoupon,
  PromotionStat,
  ReportDailyPerformance,
  ReportMetric,
  ReportPresetDataset,
  ReportPresetFilter,
  ReportTopDish,
  SalesTrendPoint,
  SidebarLink,
  SystemAlert,
  TopDish,
} from '../components/admin/adminDashboard/adminDashboard.types'

// Fecha fija de referencia para la maqueta visual del dashboard.
export const adminDateLabel = 'Domingo, 19 de abril de 2026'

// Mapea el titulo y subtitulo por pestaña activa del panel admin.
export const adminTabLabels: Record<AdminTabId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: adminDateLabel,
  },
  pedidos: {
    title: 'Pedidos',
    subtitle: 'Gestion operativa de pedidos en tiempo real',
  },
  menu: {
    title: 'Menu',
    subtitle: 'Gestion de platillos y macros nutricionales',
  },
  promociones: {
    title: 'Promociones',
    subtitle: 'Cupones activos y reglas de elegibilidad de compra',
  },
  reportes: {
    title: 'Reportes',
    subtitle: 'Metricas de rendimiento del negocio',
  },
  usuarios: {
    title: 'Usuarios',
    subtitle: 'Gestion de clientes y consulta de historial de pedidos',
  },
}

// Opciones del menu lateral del panel admin.
export const sidebarLinks: SidebarLink[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'DB' },
  { id: 'pedidos', label: 'Pedidos', shortLabel: 'PD', badge: '2' },
  { id: 'menu', label: 'Menu', shortLabel: 'MN' },
  { id: 'promociones', label: 'Promociones', shortLabel: 'PR' },
  { id: 'reportes', label: 'Reportes', shortLabel: 'RP' },
  { id: 'usuarios', label: 'Usuarios', shortLabel: 'US' },
]

// Tarjetas KPI de la primera fila del dashboard.
export const dashboardMetrics: DashboardMetric[] = [
  {
    id: 'ventas',
    icon: 'COP',
    value: 'COP 1.823.000',
    label: 'Ventas hoy',
    badge: '+12%',
    tone: 'success',
  },
  { id: 'pedidos', icon: '[]', value: '4', label: 'Pedidos hoy', badge: '+8%', tone: 'info' },
  {
    id: 'ticket',
    icon: '->',
    value: 'COP 45.600',
    label: 'Ticket promedio',
    badge: '+3%',
    tone: 'warning',
  },
  {
    id: 'activos',
    icon: 'CL',
    value: '3',
    label: 'Pedidos activos',
    badge: '3 en proceso',
    tone: 'neutral',
  },
]

// Serie de ventas para el grafico lineal de tendencia.
export const salesTrendData: SalesTrendPoint[] = [
  { day: '04-12', amount: 500000 },
  { day: '04-13', amount: 520000 },
  { day: '04-14', amount: 460000 },
  { day: '04-15', amount: 640000 },
  { day: '04-16', amount: 720000 },
  { day: '04-17', amount: 860000 },
  { day: '04-18', amount: 900000 },
  { day: '04-19', amount: 560000 },
]

// Distribucion por categoria para dona y leyenda lateral.
export const categoryDistributionData: CategoryDistribution[] = [
  { id: 'almuerzo', label: 'Almuerzo', percentage: 38, color: '#4ba95c' },
  { id: 'cena', label: 'Cena', percentage: 28, color: '#72c780' },
  { id: 'desayuno', label: 'Desayuno', percentage: 20, color: '#9ce5a6' },
  { id: 'smoothies', label: 'Smoothies', percentage: 10, color: '#d0f4d5' },
  { id: 'extras', label: 'Extras', percentage: 4, color: '#f2a456' },
]

// Lista de pedidos activos para supervision operativa.
export const activeOrdersData: ActiveOrder[] = [
  {
    id: 'ORD-807394',
    customer: 'Alex Martinez',
    items: 1,
    total: 'COP 28.000',
    status: 'Recibido',
  },
  {
    id: 'ORD-001',
    customer: 'Alex Martinez',
    items: 2,
    total: 'COP 54.900',
    status: 'En camino',
  },
  {
    id: 'ORD-003',
    customer: 'Carlos Ruiz',
    items: 1,
    total: 'COP 44.500',
    status: 'Preparando',
  },
]

// Ranking de platos top con pedidos e ingreso.
export const topDishesData: TopDish[] = [
  { id: 'dish-1', name: 'Acai Power Bowl', orders: 3, revenue: 'COP 85.500' },
  { id: 'dish-2', name: 'Green Detox Smoothie', orders: 3, revenue: 'COP 33.500' },
  { id: 'dish-3', name: 'Power Chicken Bowl', orders: 1, revenue: 'COP 26.400' },
  { id: 'dish-4', name: 'Salmon Mediterraneo', orders: 1, revenue: 'COP 34.000' },
  { id: 'dish-5', name: 'Meal Prep Box Semanal', orders: 1, revenue: 'COP 140.000' },
]

// Alertas de negocio para que el admin actue rapido.
export const systemAlertsData: SystemAlert[] = [
  {
    id: 'alert-1',
    message: 'Salmon fresco por debajo del stock minimo (3.5 kg disponibles, minimo 4 kg).',
  },
  {
    id: 'alert-2',
    message: 'Filete de atun por debajo del stock minimo (2 kg disponibles, minimo 3 kg).',
  },
  {
    id: 'alert-3',
    message: 'Pan de centeno bajo stock (1 pza disponible, minimo 8 pzas).',
  },
]

// Dataset estatico para la pestaña de pedidos con emojis de platos.
export const managedOrdersData: ManagedOrder[] = [
  {
    id: 'ORD-807394',
    timeLabel: '11:56 a.m.',
    customerName: 'Alex Martinez',
    dishEmojis: ['🍗'],
    total: 'COP 28.000',
    deliveryType: 'Delivery',
    status: 'Recibido',
    primaryAction: 'Iniciar preparacion',
  },
  {
    id: 'ORD-004',
    timeLabel: '11:51 a.m.',
    customerName: 'Maria Gonzalez',
    dishEmojis: ['🥗'],
    total: 'COP 62.900',
    deliveryType: 'Delivery',
    status: 'Entregado',
  },
  {
    id: 'ORD-003',
    timeLabel: '11:41 a.m.',
    customerName: 'Carlos Ruiz',
    dishEmojis: ['🍗'],
    total: 'COP 44.500',
    deliveryType: 'Delivery',
    status: 'Preparando',
    primaryAction: 'Marcar listo',
  },
  {
    id: 'ORD-001',
    timeLabel: '11:26 a.m.',
    customerName: 'Alex Martinez',
    dishEmojis: ['🥩', '🥙'],
    total: 'COP 54.900',
    deliveryType: 'Delivery',
    status: 'En camino',
    primaryAction: 'Marcar entregado',
  },
  {
    id: 'ORD-002',
    timeLabel: '11:56 a.m.',
    customerName: 'Alex Martinez',
    dishEmojis: ['🥪'],
    total: 'COP 22.100',
    deliveryType: 'Retiro',
    status: 'Entregado',
  },
  {
    id: 'ORD-005',
    timeLabel: '11:56 a.m.',
    customerName: 'Luis Hernandez',
    dishEmojis: ['🥙', '🥗'],
    total: 'COP 42.500',
    deliveryType: 'Retiro',
    status: 'Entregado',
  },
]

// Categorias visibles en el filtro superior de la pestaña menu.
export const menuFilterCategories: MenuFilterCategory[] = [
  'Todos',
  'Desayuno',
  'Almuerzo',
  'Cena',
  'Smoothies',
  'Snacks',
  'Suplementos',
]

// Dataset estatico inicial para gestion de platillos (solo emojis, sin fotos).
export const menuDishesData: MenuDish[] = [
  {
    id: 'dish-01',
    name: 'Power Chicken Bowl',
    description: 'Pechuga de pollo, quinoa y vegetales salteados.',
    emoji: '🍗',
    price: 28000,
    calories: 520,
    protein: 48,
    carbs: 42,
    rating: 4.8,
    reviews: 342,
    category: 'Almuerzo',
    featured: true,
  },
  {
    id: 'dish-02',
    name: 'Salmon Mediterraneo',
    description: 'Salmon al horno con vegetales y aceite de oliva.',
    emoji: '🐟',
    price: 34000,
    calories: 480,
    protein: 42,
    carbs: 18,
    rating: 4.9,
    reviews: 218,
    category: 'Cena',
    featured: true,
  },
  {
    id: 'dish-03',
    name: 'Acai Power Bowl',
    description: 'Acai con frutas frescas, granola y chia.',
    emoji: '🫐',
    price: 22000,
    calories: 380,
    protein: 12,
    carbs: 62,
    rating: 4.7,
    reviews: 166,
    category: 'Desayuno',
    featured: true,
  },
  {
    id: 'dish-04',
    name: 'Avocado Toast Fit',
    description: 'Pan integral con aguacate, huevo y microgreens.',
    emoji: '🥑',
    price: 18000,
    calories: 410,
    protein: 18,
    carbs: 38,
    rating: 4.6,
    reviews: 89,
    category: 'Desayuno',
  },
  {
    id: 'dish-05',
    name: 'Green Detox Smoothie',
    description: 'Espinaca, manzana verde, limon y jengibre.',
    emoji: '🥤',
    price: 14000,
    calories: 180,
    protein: 4,
    carbs: 36,
    rating: 4.5,
    reviews: 203,
    category: 'Smoothies',
    featured: true,
  },
  {
    id: 'dish-06',
    name: 'Greek Yogurt Parfait',
    description: 'Yogurt griego natural con frutos rojos y miel.',
    emoji: '🍓',
    price: 16000,
    calories: 320,
    protein: 22,
    carbs: 44,
    rating: 4.4,
    reviews: 112,
    category: 'Desayuno',
  },
  {
    id: 'dish-07',
    name: 'Tuna Steak & Veggies',
    description: 'Atun sellado con esparragos y papas baby.',
    emoji: '🥩',
    price: 42000,
    calories: 440,
    protein: 52,
    carbs: 22,
    rating: 4.7,
    reviews: 96,
    category: 'Cena',
  },
  {
    id: 'dish-08',
    name: 'Meal Prep Box Semanal',
    description: 'Caja balanceada para varios dias de la semana.',
    emoji: '📦',
    price: 140000,
    calories: 480,
    protein: 40,
    carbs: 50,
    rating: 4.9,
    reviews: 74,
    category: 'Suplementos',
    featured: true,
  },
  {
    id: 'dish-09',
    name: 'Protein Pancakes',
    description: 'Pancakes de avena y whey con topping de frutas.',
    emoji: '🥞',
    price: 18000,
    calories: 450,
    protein: 35,
    carbs: 52,
    rating: 4.6,
    reviews: 91,
    category: 'Snacks',
  },
  {
    id: 'dish-10',
    name: 'Energy Bites Cacao',
    description: 'Snack de cacao, datil y mani para pre-entreno.',
    emoji: '🍫',
    price: 9000,
    calories: 220,
    protein: 10,
    carbs: 24,
    rating: 4.3,
    reviews: 58,
    category: 'Snacks',
  },
]

// Metricas superiores para la pestaña de promociones.
export const promotionStatsData: PromotionStat[] = [
  { id: 'active-coupons', label: 'Cupones activos', value: '3', tone: 'success' },
  { id: 'inactive-coupons', label: 'Cupones inactivos', value: '1', tone: 'warning' },
  { id: 'total-uses', label: 'Usos totales', value: '879', tone: 'info' },
  { id: 'expired-coupons', label: 'Expirados', value: '4', tone: 'danger' },
]

// Cupones estaticos para la vista administrativa de promociones.
export const promotionCouponsData: PromotionCoupon[] = [
  {
    id: 'coupon-01',
    code: 'FIT10',
    title: '10% de descuento en cualquier pedido',
    description: 'Ideal para recompra semanal de clientes frecuentes.',
    discountType: 'percentage',
    discountValue: 10,
    currentUses: 234,
    maxUses: 500,
    expiresOn: '2025-12-31',
    status: 'Activo',
    conditions: {
      minOrderTotal: 45000,
      takeoutOnly: false,
      minItems: 1,
      firstOrderOnly: false,
    },
  },
  {
    id: 'coupon-02',
    code: 'PRIMERA10',
    title: '10% off en tu primer pedido',
    description: 'Incentiva conversion de nuevos usuarios.',
    discountType: 'percentage',
    discountValue: 10,
    currentUses: 456,
    maxUses: 1000,
    expiresOn: '2025-12-31',
    status: 'Activo',
    conditions: {
      minOrderTotal: 30000,
      takeoutOnly: false,
      minItems: 1,
      firstOrderOnly: true,
    },
  },
  {
    id: 'coupon-03',
    code: 'ENVIOGRATIS',
    title: 'Envio gratis en pedidos mayores a COP 80.000',
    description: 'Beneficio para tickets altos por delivery.',
    discountType: 'free-shipping',
    discountValue: 0,
    currentUses: 89,
    maxUses: 200,
    expiresOn: '2025-06-30',
    status: 'Activo',
    conditions: {
      minOrderTotal: 80000,
      takeoutOnly: false,
      minItems: 2,
      firstOrderOnly: false,
    },
  },
  {
    id: 'coupon-04',
    code: 'PROTEINA50',
    title: 'COP 15.000 de descuento en pedidos de volumen',
    description: 'Promocion enfocada en clientes con alto ticket.',
    discountType: 'fixed-amount',
    discountValue: 15000,
    currentUses: 100,
    maxUses: 100,
    expiresOn: '2025-03-31',
    status: 'Inactivo',
    conditions: {
      minOrderTotal: 120000,
      takeoutOnly: false,
      minItems: 3,
      firstOrderOnly: false,
    },
  },
]

// Usuarios clientes estaticos para gestion en admin.
export const managedUsersData: ManagedUser[] = [
  {
    id: 'user-01',
    fullName: 'Alex Martinez',
    avatarEmoji: '🧑‍🍳',
    email: 'cliente@fitfuel.com',
    phone: '+57 3001234567',
    memberSinceLabel: 'Desde enero de 2024',
    memberMonths: 27,
    totalOrders: 18,
    role: 'Cliente',
    isNewThisMonth: true,
    orders: [
      { id: 'ORD-807394', dateLabel: '18/04/2026', total: 'COP 28.000', status: 'En camino' },
      { id: 'ORD-001', dateLabel: '12/04/2026', total: 'COP 54.900', status: 'Entregado' },
      { id: 'ORD-221', dateLabel: '05/04/2026', total: 'COP 33.200', status: 'Entregado' },
    ],
  },
  {
    id: 'user-02',
    fullName: 'Maria Gonzalez',
    avatarEmoji: '👩‍💼',
    email: 'maria@email.com',
    phone: '+57 3012345678',
    memberSinceLabel: 'Desde abril de 2024',
    memberMonths: 24,
    totalOrders: 11,
    role: 'Cliente',
    isNewThisMonth: true,
    orders: [
      { id: 'ORD-004', dateLabel: '17/04/2026', total: 'COP 62.900', status: 'Entregado' },
      { id: 'ORD-190', dateLabel: '02/04/2026', total: 'COP 27.800', status: 'Entregado' },
    ],
  },
  {
    id: 'user-03',
    fullName: 'Sara Lopez',
    avatarEmoji: '👩‍💻',
    email: 'admin@fitfuel.com',
    phone: '+57 3023456789',
    memberSinceLabel: 'Desde junio de 2023',
    memberMonths: 34,
    totalOrders: 6,
    role: 'Cliente',
    isNewThisMonth: false,
    orders: [
      { id: 'ORD-145', dateLabel: '07/04/2026', total: 'COP 18.800', status: 'Entregado' },
      { id: 'ORD-146', dateLabel: '10/03/2026', total: 'COP 24.000', status: 'Cancelado' },
    ],
  },
  {
    id: 'user-04',
    fullName: 'Carlos Ruiz',
    avatarEmoji: '👨‍⚕️',
    email: 'carlos@email.com',
    phone: '+57 3034567890',
    memberSinceLabel: 'Desde marzo de 2024',
    memberMonths: 25,
    totalOrders: 9,
    role: 'Cliente',
    isNewThisMonth: false,
    orders: [{ id: 'ORD-003', dateLabel: '18/04/2026', total: 'COP 44.500', status: 'Preparando' }],
  },
  {
    id: 'user-05',
    fullName: 'Luis Hernandez',
    avatarEmoji: '🧑‍🔬',
    email: 'luis@email.com',
    phone: '+57 3045678901',
    memberSinceLabel: 'Desde febrero de 2024',
    memberMonths: 26,
    totalOrders: 14,
    role: 'Cliente',
    isNewThisMonth: true,
    orders: [
      { id: 'ORD-005', dateLabel: '16/04/2026', total: 'COP 42.500', status: 'Entregado' },
      { id: 'ORD-080', dateLabel: '29/03/2026', total: 'COP 20.600', status: 'Entregado' },
      { id: 'ORD-049', dateLabel: '12/03/2026', total: 'COP 28.500', status: 'Entregado' },
    ],
  },
  {
    id: 'user-06',
    fullName: 'Ana Torres',
    avatarEmoji: '👩‍🎓',
    email: 'ana@email.com',
    phone: '+57 3056789012',
    memberSinceLabel: 'Desde agosto de 2023',
    memberMonths: 32,
    totalOrders: 4,
    role: 'Cliente',
    isNewThisMonth: true,
    orders: [
      { id: 'ORD-099', dateLabel: '14/04/2026', total: 'COP 15.200', status: 'Entregado' },
      { id: 'ORD-042', dateLabel: '01/02/2026', total: 'COP 19.800', status: 'Entregado' },
    ],
  },
]

// Formatea una fecha UTC al formato ISO yyyy-mm-dd.
const toIsoDate = (date: Date): string => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Construye una secuencia de fechas ISO consecutivas.
const buildIsoDateRange = (startDate: string, totalDays: number): string[] => {
  const start = new Date(`${startDate}T00:00:00Z`)

  return Array.from({ length: totalDays }, (_, index) => {
    const next = new Date(start)
    next.setUTCDate(start.getUTCDate() + index)
    return toIsoDate(next)
  })
}

// Convierte fecha ISO a etiqueta compacta MM-DD para ejes X diarios.
const toMonthDayLabel = (isoDate: string): string => isoDate.slice(5)

// Construye serie diaria de ingresos para Recharts.
const buildDailyRevenueSeries = (dates: string[], values: number[]): DailyRevenueData[] =>
  dates.map((date, index) => ({
    date,
    label: toMonthDayLabel(date),
    revenue: values[index] ?? 0,
  }))

// Construye serie diaria de pedidos para Recharts.
const buildDailyOrdersSeries = (dates: string[], values: number[]): DailyOrdersData[] =>
  dates.map((date, index) => ({
    date,
    label: toMonthDayLabel(date),
    orders: values[index] ?? 0,
  }))

// Fechas fijas de la vista semanal (referencia del mock visual).
const reportWeekDates = [
  '2026-04-12',
  '2026-04-13',
  '2026-04-14',
  '2026-04-15',
  '2026-04-16',
  '2026-04-17',
  '2026-04-18',
  '2026-04-19',
]

// Ingresos diarios para Semana (match con diseño de referencia).
const reportWeekRevenueValues = [840000, 910000, 760000, 1240000, 1370000, 1590000, 1630000, 740000]

// Pedidos diarios para Semana (match con diseño de referencia).
const reportWeekOrderValues = [42, 48, 39, 58, 65, 77, 81, 52]

// Fechas del periodo mensual simulado para analitica.
const reportMonthDates = buildIsoDateRange('2026-03-21', 30)

// Ingresos diarios para Mes (periodo de 30 dias).
const reportMonthRevenueValues = [
  980000, 1020000, 1070000, 995000, 1110000, 1160000, 1095000, 1220000, 1260000, 1320000, 1240000, 1360000, 1410000, 1450000, 1380000, 1490000, 1530000, 1580000, 1620000, 1550000, 1640000, 1680000, 840000, 910000, 760000, 1240000, 1370000, 1590000, 1630000, 740000
]

// Pedidos diarios para Mes (periodo de 30 dias).
const reportMonthOrderValues = [
  51, 54, 58, 52, 60, 62, 59, 66, 69, 72, 68, 74, 76, 79, 73, 82, 85, 88, 92, 86, 95, 98, 42,
  48, 39, 58, 65, 77, 81, 52,
]

// Etiquetas y fechas para vista anual agregada por mes.
const reportYearMonthLabels = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

const reportYearMonthDates = [
  '2026-01',
  '2026-02',
  '2026-03',
  '2026-04',
  '2026-05',
  '2026-06',
  '2026-07',
  '2026-08',
  '2026-09',
  '2026-10',
  '2026-11',
  '2026-12',
]

// Ingresos agregados por mes para la vista anual.
const reportYearRevenueValues = [
  25500000, 26800000, 28100000, 38240000, 39600000, 41200000, 43100000, 43800000, 42100000, 44700000, 46200000, 48900000
]

// Pedidos agregados por mes para la vista anual.
const reportYearOrderValues = [1320, 1385, 1492, 2061, 2148, 2235, 2312, 2380, 2274, 2416, 2490, 2618]

// Metricas semanales del tab reportes.
const weekReportMetrics: ReportMetric[] = [
  {
    id: 'week-revenue',
    label: 'Ingresos totales',
    value: 'COP 9.080.000',
    change: '+12.5%',
    changeType: 'positive',
    changeLabel: 'ultimos 8 dias',
  },
  {
    id: 'week-orders',
    label: 'Total pedidos',
    value: '462',
    change: '+8.2%',
    changeType: 'positive',
    changeLabel: 'ultimos 8 dias',
  },
  {
    id: 'week-ticket',
    label: 'Ticket promedio',
    value: 'COP 19.700',
    change: '+3.1%',
    changeType: 'positive',
    changeLabel: 'por pedido',
  },
  {
    id: 'week-conversion',
    label: 'Tasa conversion',
    value: '78%',
    change: '+2%',
    changeType: 'positive',
    changeLabel: 'carrito -> compra',
  },
]

// Metricas mensuales del tab reportes.
const monthReportMetrics: ReportMetric[] = [
  {
    id: 'month-revenue',
    label: 'Ingresos totales',
    value: 'COP 38.240.000',
    change: '+9.6%',
    changeType: 'positive',
    changeLabel: 'ultimos 30 dias',
  },
  {
    id: 'month-orders',
    label: 'Total pedidos',
    value: '2,061',
    change: '+7.4%',
    changeType: 'positive',
    changeLabel: 'ultimos 30 dias',
  },
  {
    id: 'month-ticket',
    label: 'Ticket promedio',
    value: 'COP 18.600',
    change: '+1.8%',
    changeType: 'positive',
    changeLabel: 'por pedido',
  },
  {
    id: 'month-conversion',
    label: 'Tasa conversion',
    value: '74%',
    change: '+1.2%',
    changeType: 'positive',
    changeLabel: 'carrito -> compra',
  },
]

// Metricas anuales del tab reportes.
const yearReportMetrics: ReportMetric[] = [
  {
    id: 'year-revenue',
    label: 'Ingresos totales',
    value: 'COP 468.000.000',
    change: '+16.2%',
    changeType: 'positive',
    changeLabel: 'acumulado anual',
  },
  {
    id: 'year-orders',
    label: 'Total pedidos',
    value: '25,131',
    change: '+14.1%',
    changeType: 'positive',
    changeLabel: 'acumulado anual',
  },
  {
    id: 'year-ticket',
    label: 'Ticket promedio',
    value: 'COP 18.600',
    change: '+2.0%',
    changeType: 'positive',
    changeLabel: 'por pedido',
  },
  {
    id: 'year-conversion',
    label: 'Tasa conversion',
    value: '76%',
    change: '+3.4%',
    changeType: 'positive',
    changeLabel: 'carrito -> compra',
  },
]

// Serie de horas pico para cada preset.
const reportPeakHoursByPreset: Record<ReportPresetFilter, PeakHourData[]> = {
  Semana: [
    { time: '7am', orders: 12 },
    { time: '8am', orders: 28 },
    { time: '9am', orders: 22 },
    { time: '10am', orders: 8 },
    { time: '11am', orders: 7 },
    { time: '12pm', orders: 45 },
    { time: '1pm', orders: 63, isPeak: true },
    { time: '2pm', orders: 48 },
    { time: '3pm', orders: 15 },
    { time: '4pm', orders: 10 },
    { time: '5pm', orders: 8 },
    { time: '6pm', orders: 35 },
    { time: '7pm', orders: 52, isPeak: true },
    { time: '8pm', orders: 44, isPeak: true },
    { time: '9pm', orders: 18 },
  ],
  Mes: [
    { time: '7am', orders: 18 },
    { time: '8am', orders: 36 },
    { time: '9am', orders: 29 },
    { time: '10am', orders: 13 },
    { time: '11am', orders: 11 },
    { time: '12pm', orders: 59 },
    { time: '1pm', orders: 81, isPeak: true },
    { time: '2pm', orders: 64 },
    { time: '3pm', orders: 23 },
    { time: '4pm', orders: 16 },
    { time: '5pm', orders: 14 },
    { time: '6pm', orders: 48 },
    { time: '7pm', orders: 70, isPeak: true },
    { time: '8pm', orders: 63, isPeak: true },
    { time: '9pm', orders: 27 },
  ],
  Año: [
    { time: '7am', orders: 25 },
    { time: '8am', orders: 41 },
    { time: '9am', orders: 33 },
    { time: '10am', orders: 18 },
    { time: '11am', orders: 15 },
    { time: '12pm', orders: 66 },
    { time: '1pm', orders: 93, isPeak: true },
    { time: '2pm', orders: 74 },
    { time: '3pm', orders: 31 },
    { time: '4pm', orders: 23 },
    { time: '5pm', orders: 19 },
    { time: '6pm', orders: 56 },
    { time: '7pm', orders: 82, isPeak: true },
    { time: '8pm', orders: 75, isPeak: true },
    { time: '9pm', orders: 35 },
  ],
}

// Rendimiento por categoria para cada preset.
const reportCategoryPerformanceByPreset: Record<ReportPresetFilter, CategoryPerformanceData[]> = {
  Semana: [
    { category: 'Almuerzo', revenue: 4500000, color: '#4aa157' },
    { category: 'Cena', revenue: 3100000, color: '#63b768' },
    { category: 'Desayuno', revenue: 2200000, color: '#7fce86' },
    { category: 'Smoothies', revenue: 1100000, color: '#9adfa3' },
    { category: 'Snacks', revenue: 500000, color: '#e68a3b' },
  ],
  Mes: [
    { category: 'Almuerzo', revenue: 18800000, color: '#4aa157' },
    { category: 'Cena', revenue: 13300000, color: '#63b768' },
    { category: 'Desayuno', revenue: 9100000, color: '#7fce86' },
    { category: 'Smoothies', revenue: 4600000, color: '#9adfa3' },
    { category: 'Snacks', revenue: 2400000, color: '#e68a3b' },
  ],
  Año: [
    { category: 'Almuerzo', revenue: 218000000, color: '#4aa157' },
    { category: 'Cena', revenue: 156000000, color: '#63b768' },
    { category: 'Desayuno', revenue: 101000000, color: '#7fce86' },
    { category: 'Smoothies', revenue: 54800000, color: '#9adfa3' },
    { category: 'Snacks', revenue: 38400000, color: '#e68a3b' },
  ],
}

// Ranking top platos por ingresos para cada preset.
const reportTopDishesByPreset: Record<ReportPresetFilter, ReportTopDish[]> = {
  Semana: [
    {
      position: 1,
      name: 'Meal Prep Box Semanal',
      orders: 7,
      revenue: 69900,
      sharePercentage: 28.8,
      shareColor: '#57b764',
    },
    {
      position: 2,
      name: 'Acai Power Bowl',
      orders: 6,
      revenue: 55500,
      sharePercentage: 22.9,
      shareColor: '#78c97a',
    },
    {
      position: 3,
      name: 'Green Detox Smoothie',
      orders: 5,
      revenue: 33500,
      sharePercentage: 13.8,
      shareColor: '#8fd892',
    },
    {
      position: 4,
      name: 'Salmon Mediterraneo',
      orders: 4,
      revenue: 29000,
      sharePercentage: 12.0,
      shareColor: '#acdba8',
    },
    {
      position: 5,
      name: 'Power Chicken Bowl',
      orders: 3,
      revenue: 24600,
      sharePercentage: 10.2,
      shareColor: '#e08b3f',
    },
  ],
  Mes: [
    {
      position: 1,
      name: 'Meal Prep Box Semanal',
      orders: 78,
      revenue: 745000,
      sharePercentage: 27.6,
      shareColor: '#57b764',
    },
    {
      position: 2,
      name: 'Acai Power Bowl',
      orders: 71,
      revenue: 689000,
      sharePercentage: 25.5,
      shareColor: '#78c97a',
    },
    {
      position: 3,
      name: 'Green Detox Smoothie',
      orders: 58,
      revenue: 512000,
      sharePercentage: 18.9,
      shareColor: '#8fd892',
    },
    {
      position: 4,
      name: 'Salmon Mediterraneo',
      orders: 53,
      revenue: 473000,
      sharePercentage: 17.5,
      shareColor: '#acdba8',
    },
    {
      position: 5,
      name: 'Power Chicken Bowl',
      orders: 46,
      revenue: 282000,
      sharePercentage: 10.5,
      shareColor: '#e08b3f',
    },
  ],
  Año: [
    {
      position: 1,
      name: 'Meal Prep Box Semanal',
      orders: 812,
      revenue: 7784000,
      sharePercentage: 29.1,
      shareColor: '#57b764',
    },
    {
      position: 2,
      name: 'Acai Power Bowl',
      orders: 756,
      revenue: 7312000,
      sharePercentage: 27.4,
      shareColor: '#78c97a',
    },
    {
      position: 3,
      name: 'Green Detox Smoothie',
      orders: 644,
      revenue: 5621000,
      sharePercentage: 21.0,
      shareColor: '#8fd892',
    },
    {
      position: 4,
      name: 'Salmon Mediterraneo',
      orders: 512,
      revenue: 3849000,
      sharePercentage: 14.4,
      shareColor: '#acdba8',
    },
    {
      position: 5,
      name: 'Power Chicken Bowl',
      orders: 469,
      revenue: 2176000,
      sharePercentage: 8.1,
      shareColor: '#e08b3f',
    },
  ],
}

// Seed diario para construir filtros personalizados sin backend.
export const reportCustomPerformanceSeedData: ReportDailyPerformance[] = reportMonthDates.map(
  (date, index) => ({
    date,
    label: toMonthDayLabel(date),
    revenue: reportMonthRevenueValues[index] ?? 0,
    orders: reportMonthOrderValues[index] ?? 0,
    conversionRate: Number((71 + ((index % 7) * 1.1 + (index >= 20 ? 1.8 : 0))).toFixed(1)),
  }),
)

// Snapshots estaticos por filtro de periodo para la pestaña reportes.
export const reportPresetData: Record<ReportPresetFilter, ReportPresetDataset> = {
  Semana: {
    rangeLabel: 'Semana actual',
    dateRange: {
      start: reportWeekDates[0],
      end: reportWeekDates[reportWeekDates.length - 1],
    },
    metrics: weekReportMetrics,
    dailyRevenue: buildDailyRevenueSeries(reportWeekDates, reportWeekRevenueValues),
    dailyOrders: buildDailyOrdersSeries(reportWeekDates, reportWeekOrderValues),
    peakHours: reportPeakHoursByPreset.Semana,
    categoryPerformance: reportCategoryPerformanceByPreset.Semana,
    topDishes: reportTopDishesByPreset.Semana,
  },
  Mes: {
    rangeLabel: 'Ultimos 30 dias',
    dateRange: {
      start: reportMonthDates[0],
      end: reportMonthDates[reportMonthDates.length - 1],
    },
    metrics: monthReportMetrics,
    dailyRevenue: buildDailyRevenueSeries(reportMonthDates, reportMonthRevenueValues),
    dailyOrders: buildDailyOrdersSeries(reportMonthDates, reportMonthOrderValues),
    peakHours: reportPeakHoursByPreset.Mes,
    categoryPerformance: reportCategoryPerformanceByPreset.Mes,
    topDishes: reportTopDishesByPreset.Mes,
  },
  Año: {
    rangeLabel: 'Acumulado anual',
    dateRange: {
      start: '2026-01-01',
      end: '2026-12-31',
    },
    metrics: yearReportMetrics,
    dailyRevenue: reportYearMonthLabels.map((label, index) => ({
      date: reportYearMonthDates[index],
      label,
      revenue: reportYearRevenueValues[index] ?? 0,
    })),
    dailyOrders: reportYearMonthLabels.map((label, index) => ({
      date: reportYearMonthDates[index],
      label,
      orders: reportYearOrderValues[index] ?? 0,
    })),
    peakHours: reportPeakHoursByPreset.Año,
    categoryPerformance: reportCategoryPerformanceByPreset.Año,
    topDishes: reportTopDishesByPreset.Año,
  },
}
