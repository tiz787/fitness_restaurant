// Define los tonos visuales disponibles para tarjetas KPI.
export type MetricTone = 'success' | 'info' | 'warning' | 'neutral'

// Define las pestañas validas del panel de administracion.
export type AdminTabId =
  | 'dashboard'
  | 'pedidos'
  | 'menu'
  | 'inventario'
  | 'promociones'
  | 'reportes'
  | 'usuarios'

// Define cada enlace del sidebar admin.
export interface SidebarLink {
  // Identificador interno de la opcion de menu.
  id: AdminTabId
  // Texto visible del enlace.
  label: string
  // Version corta para mostrar como icono de texto.
  shortLabel: string
  // Badge opcional para conteos o alertas.
  badge?: string
}

// Define los datos de cada tarjeta de metricas principales.
export interface DashboardMetric {
  // Identificador unico de la metrica.
  id: string
  // Icono textual ligero para reforzar lectura rapida.
  icon: string
  // Valor principal mostrado.
  value: string
  // Etiqueta descriptiva de la metrica.
  label: string
  // Badge de cambio porcentual o estado.
  badge: string
  // Tonalidad de color del componente.
  tone: MetricTone
}

// Define un punto de la serie temporal de ventas.
export interface SalesTrendPoint {
  // Dia o etiqueta del eje X.
  day: string
  // Valor numerico para trazar linea.
  amount: number
}

// Define los segmentos de ventas por categoria.
export interface CategoryDistribution {
  // Identificador unico de categoria.
  id: string
  // Nombre visible de la categoria.
  label: string
  // Porcentaje de participacion.
  percentage: number
  // Color usado para leyenda y dona.
  color: string
}

// Define un pedido activo del panel operativo.
export interface ActiveOrder {
  // Numero unico de pedido.
  id: string
  // Nombre del cliente.
  customer: string
  // Cantidad de platos del pedido.
  items: number
  // Total monetario formateado.
  total: string
  // Estado actual de preparacion/entrega.
  status: 'Recibido' | 'En camino' | 'Preparando'
}

// Define un plato en el ranking de mas vendidos.
export interface TopDish {
  // Identificador del plato.
  id: string
  // Nombre del producto.
  name: string
  // Cantidad de pedidos asociados.
  orders: number
  // Ingreso total generado por el plato.
  revenue: string
}

// Define una alerta operativa del sistema.
export interface SystemAlert {
  // Identificador unico de alerta.
  id: string
  // Mensaje visible en pantalla.
  message: string
}

// Define las props del dashboard principal admin.
export interface AdminDashboardProps {
  // Correo del administrador conectado para mostrar en topbar.
  adminEmail: string
  // Callback para cerrar sesion y volver al acceso.
  onSignOut: () => void
  // Callback para saltar a vista cliente temporal.
  onOpenClientPreview: () => void
}

// Define tipos de entrega disponibles para la tabla de pedidos.
export type DeliveryType = 'Delivery' | 'Retiro'

// Define estados disponibles para gestion de pedidos.
export type ManagedOrderStatus =
  | 'Recibido'
  | 'Preparando'
  | 'Listo'
  | 'En camino'
  | 'Entregado'
  | 'Cancelado'

// Define una fila de la tabla de gestion de pedidos.
export interface ManagedOrder {
  // Identificador unico del pedido.
  id: string
  // Hora de llegada o de referencia.
  timeLabel: string
  // Nombre visible del cliente.
  customerName: string
  // Lista de emojis de platos para ahorrar recursos.
  dishEmojis: string[]
  // Valor total formateado para UI.
  total: string
  // Metodo de entrega del pedido.
  deliveryType: DeliveryType
  // Estado operativo actual del pedido.
  status: ManagedOrderStatus
  // Accion principal sugerida por estado.
  primaryAction?: string
}

// Define categorias visibles de filtrado del menu admin.
export type MenuFilterCategory =
  | 'Todos'
  | 'Desayuno'
  | 'Almuerzo'
  | 'Cena'
  | 'Smoothies'
  | 'Snacks'
  | 'Suplementos'

// Define categorias validas para un plato individual.
export type MenuDishCategory = Exclude<MenuFilterCategory, 'Todos'>

// Define estructura de cada tarjeta de plato en gestion de menu.
export interface MenuDish {
  // Identificador unico del plato.
  id: string
  // Nombre comercial del plato.
  name: string
  // Descripcion corta para admin.
  description: string
  // Emoji principal del plato para evitar imagenes.
  emoji: string
  // Precio visible para referencia operativa.
  price: number
  // Total de calorias del plato.
  calories: number
  // Gramos de proteina.
  protein: number
  // Gramos de carbohidratos.
  carbs: number
  // Calificacion promedio visual.
  rating: number
  // Cantidad de reseñas disponibles.
  reviews: number
  // Categoria asignada al plato.
  category: MenuDishCategory
  // Marca visual para destacados.
  featured?: boolean
  // Indica si el plato ha sido eliminado (soft delete).
  isDeleted?: boolean
}

// Define tipos de descuento disponibles para cupones.
export type CouponDiscountType = 'percentage' | 'fixed-amount' | 'free-shipping'

// Define estados posibles de un cupon promocional.
export type CouponStatus = 'Activo' | 'Inactivo' | 'Expirado'

// Define condiciones de elegibilidad de un cupon.
export interface CouponConditions {
  // Monto minimo del pedido para activar el cupon.
  minOrderTotal: number
  // Indica si aplica solo para pedidos de llevar/retiro.
  takeoutOnly: boolean
  // Cantidad minima de productos requeridos.
  minItems: number
  // Indica si aplica solo al primer pedido del cliente.
  firstOrderOnly: boolean
}

// Define la estructura de un cupon de promociones.
export interface PromotionCoupon {
  // Identificador unico del cupon.
  id: string
  // Codigo del cupon que ingresa el cliente.
  code: string
  // Titulo visible de la promocion.
  title: string
  // Descripcion corta para panel admin.
  description: string
  // Tipo de descuento aplicado por el cupon.
  discountType: CouponDiscountType
  // Valor numerico del descuento (porcentaje o monto).
  discountValue: number
  // Cantidad de usos actuales registrados.
  currentUses: number
  // Cantidad maxima de usos permitidos.
  maxUses: number
  // Fecha limite de vencimiento en formato texto.
  expiresOn: string
  // Estado visual actual del cupon.
  status: CouponStatus
  // Condiciones de elegibilidad del cupon.
  conditions: CouponConditions
  // Indica si el cupon fue eliminado temporalmente (soft delete).
  isDeleted?: boolean
}

// Define metricas resumen para la pestaña promociones.
export interface PromotionStat {
  // Identificador unico de metrica.
  id: string
  // Etiqueta visible de la metrica.
  label: string
  // Valor de la metrica formateado.
  value: string
  // Tono visual opcional para destacar metrica.
  tone?: 'success' | 'info' | 'warning' | 'danger'
}

// Define un pedido asociado a un usuario cliente.
export interface UserOrderRecord {
  // Identificador unico del pedido.
  id: string
  // Fecha visible del pedido.
  dateLabel: string
  // Total del pedido para referencia historica.
  total: string
  // Estado actual del pedido.
  status: 'Entregado' | 'En camino' | 'Preparando' | 'Cancelado'
}

// Define el modelo de usuario gestionado por el admin.
export interface ManagedUser {
  // Identificador unico del usuario.
  id: string
  // Nombre completo del cliente.
  fullName: string
  // Emoji de avatar temporal para la UI.
  avatarEmoji: string
  // Correo del cliente.
  email: string
  // Telefono de contacto.
  phone: string
  // Texto visible de antiguedad del usuario.
  memberSinceLabel: string
  // Antiguedad en meses para filtros.
  memberMonths: number
  // Cantidad total de pedidos realizados.
  totalOrders: number
  // Rol fijo del usuario (solo cliente por ahora).
  role: 'Cliente'
  // Indica si fue registrado recientemente en el periodo actual.
  isNewThisMonth: boolean
  // Historial de pedidos del cliente.
  orders: UserOrderRecord[]
}

// Define metrics for the reports tab.
export interface ReportMetric {
  id: string
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  changeLabel: string
}

// Define data for daily revenue chart.
export interface DailyRevenueData {
  date: string
  label: string
  revenue: number
}

// Define data for daily orders chart.
export interface DailyOrdersData {
  date: string
  label: string
  orders: number
}

// Define data for peak hours chart.
export interface PeakHourData {
  time: string
  orders: number
  isPeak?: boolean
}

// Define data for category performance chart.
export interface CategoryPerformanceData {
  category: string
  revenue: number
  color: string
}

// Define top dishes table rows for reports.
export interface ReportTopDish {
  position: number
  name: string
  orders: number
  revenue: number
  sharePercentage: number
  shareColor: string
}

// Define date range used by reports filters.
export interface ReportDateRange {
  start: string
  end: string
}

// Define static snapshot used by each report preset.
export interface ReportPresetDataset {
  rangeLabel: string
  dateRange: ReportDateRange
  metrics: ReportMetric[]
  dailyRevenue: DailyRevenueData[]
  dailyOrders: DailyOrdersData[]
  peakHours: PeakHourData[]
  categoryPerformance: CategoryPerformanceData[]
  topDishes: ReportTopDish[]
}

// Define seed data used to build custom date ranges.
export interface ReportDailyPerformance {
  date: string
  label: string
  revenue: number
  orders: number
  conversionRate: number
}

// Selectable time filters for reports.
export type ReportTimeFilter = 'Semana' | 'Mes' | 'Año' | 'Personalizado'

// Preset filters that have pre-built report snapshots.
export type ReportPresetFilter = Exclude<ReportTimeFilter, 'Personalizado'>
