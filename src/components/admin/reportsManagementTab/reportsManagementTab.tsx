import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  CategoryPerformanceData,
  PeakHourData,
  ReportMetric,
  ReportPresetDataset,
  ReportTimeFilter,
  ReportTopDish,
} from '../adminDashboard/adminDashboard.types'
import './reportsManagementTab.css'
import { listenToAllOrders } from '../../../services/firebase/orders.services'
import { listenToAllProducts } from '../../../services/firebase/products.services'
import type { OrderDocument, ProductDocument } from '../../../services/firebase/types'

type ReportsTabFilter = ReportTimeFilter | 'Día'
type SeriesMode = 'hour' | 'day' | 'month'

interface ActiveRange {
  start: Date
  end: Date
  previousStart: Date
  previousEnd: Date
  rangeLabel: string
  seriesMode: SeriesMode
}

const reportTimeFilters: ReportsTabFilter[] = ['Día', 'Mes', 'Año', 'Personalizado']

const monthLabels = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const formatCurrency = (value: number): string =>
  `COP ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value)}`

const formatAxisCurrency = (value: number): string => {
  if (value >= 1_000_000) return `COP ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `COP ${(value / 1_000).toFixed(0)}k`
  return `COP ${value.toLocaleString('es-CO')}`
}

const formatSignedPercentage = (currentValue: number, previousValue: number): string => {
  if (previousValue <= 0 && currentValue > 0) return '+100.0%'
  if (previousValue <= 0) return '0.0%'
  const change = ((currentValue - previousValue) / previousValue) * 100
  return `${change >= 0 ? '+' : '-'}${Math.abs(change).toFixed(1)}%`
}

const getChangeType = (
  currentValue: number,
  previousValue: number,
): ReportMetric['changeType'] => {
  if (currentValue === previousValue) return 'neutral'
  return currentValue > previousValue ? 'positive' : 'negative'
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

const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toDayKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toMonthKey = (year: number, month: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

const toHourKey = (date: Date): string => {
  return `${toDayKey(date)}-${String(date.getHours()).padStart(2, '0')}`
}

const createDaySeriesTemplate = (start: Date, end: Date) => {
  const template: Array<{ key: string; label: string }> = []
  const cursor = new Date(start)

  while (cursor <= end) {
    template.push({
      key: toDayKey(cursor),
      label: `${String(cursor.getDate()).padStart(2, '0')}/${String(cursor.getMonth() + 1).padStart(2, '0')}`,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return template
}

const createMonthSeriesTemplate = (year: number) => {
  return monthLabels.map((label, monthIndex) => ({
    key: toMonthKey(year, monthIndex),
    label: label.slice(0, 3),
  }))
}

const createHourSeriesTemplate = (start: Date, end: Date, includeDatePrefix: boolean) => {
  const template: Array<{ key: string; label: string }> = []
  const cursor = new Date(start)
  cursor.setMinutes(0, 0, 0)

  while (cursor <= end) {
    const hourLabel = `${String(cursor.getHours()).padStart(2, '0')}:00`
    const dayLabel = `${String(cursor.getDate()).padStart(2, '0')}/${String(cursor.getMonth() + 1).padStart(2, '0')}`

    template.push({
      key: toHourKey(cursor),
      label: includeDatePrefix ? `${dayLabel} ${hourLabel}` : hourLabel,
    })

    cursor.setHours(cursor.getHours() + 1)
  }

  return template
}

const resolveRange = (
  tab: ReportsTabFilter,
  selectedMonth: number,
  selectedYear: number,
  selectedDayDate: string,
  startDate: string,
  endDate: string,
): ActiveRange => {
  const now = new Date()

  if (tab === 'Día') {
    const start = selectedDayDate
      ? new Date(`${selectedDayDate}T00:00:00`)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const end = new Date(start)
    end.setHours(23, 59, 59, 999)

    const previousStart = new Date(start)
    previousStart.setDate(previousStart.getDate() - 1)
    const previousEnd = new Date(end)
    previousEnd.setDate(previousEnd.getDate() - 1)

    return {
      start,
      end,
      previousStart,
      previousEnd,
      rangeLabel: `Día ${toDateInputValue(start)}`,
      seriesMode: 'hour',
    }
  }

  if (tab === 'Año') {
    const start = new Date(selectedYear, 0, 1, 0, 0, 0, 0)
    const end = new Date(selectedYear, 11, 31, 23, 59, 59, 999)
    const previousStart = new Date(selectedYear - 1, 0, 1, 0, 0, 0, 0)
    const previousEnd = new Date(selectedYear - 1, 11, 31, 23, 59, 59, 999)

    return {
      start,
      end,
      previousStart,
      previousEnd,
      rangeLabel: `Año ${selectedYear}`,
      seriesMode: 'month',
    }
  }

  if (tab === 'Personalizado') {
    const initialStart = startDate
      ? new Date(`${startDate}T00:00:00`)
      : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
    const initialEnd = endDate
      ? new Date(`${endDate}T23:59:59.999`)
      : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    const hasValidRange = initialStart <= initialEnd
    const start = hasValidRange ? initialStart : initialEnd
    const end = hasValidRange ? initialEnd : initialStart

    const rangeDuration = Math.max(1, end.getTime() - start.getTime())
    const rangeDays = Math.ceil((rangeDuration + 1) / (24 * 60 * 60 * 1000))
    const previousEnd = new Date(start.getTime() - 1)
    const previousStart = new Date(previousEnd.getTime() - rangeDuration)

    return {
      start,
      end,
      previousStart,
      previousEnd,
      rangeLabel: `Personalizado (${toDateInputValue(start)} a ${toDateInputValue(end)})`,
      seriesMode: rangeDays < 5 ? 'hour' : 'day',
    }
  }

  const start = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0)
  const end = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999)
  const previousStart = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0, 0)
  const previousEnd = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999)

  return {
    start,
    end,
    previousStart,
    previousEnd,
    rangeLabel: `${monthLabels[selectedMonth]} ${selectedYear}`,
    seriesMode: 'day',
  }
}

export default function ReportsManagementTab() {
  const now = useMemo(() => new Date(), [])
  const [activeTab, setActiveTab] = useState<ReportsTabFilter>('Mes')
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear())
  const [selectedDayDate, setSelectedDayDate] = useState<string>(toDateInputValue(now))
  const [startDate, setStartDate] = useState<string>(toDateInputValue(new Date(now.getFullYear(), now.getMonth(), 1)))
  const [endDate, setEndDate] = useState<string>(toDateInputValue(now))
  const [orders, setOrders] = useState<OrderDocument[]>([])
  const [products, setProducts] = useState<ProductDocument[]>([])

  useEffect(() => {
    const unsubOrders = listenToAllOrders(setOrders)
    const unsubProducts = listenToAllProducts(setProducts)

    return () => {
      unsubOrders()
      unsubProducts()
    }
  }, [])

  const availableYears = useMemo(() => {
    const years = new Set<number>([new Date().getFullYear()])

    orders.forEach((order) => {
      const dateValue = resolveISOOrTimestamp(order.createdAt)
      if (dateValue) years.add(dateValue.getFullYear())
    })

    return Array.from(years).sort((a, b) => b - a)
  }, [orders])

  const selectedRange = useMemo(
    () =>
      resolveRange(
        activeTab,
        selectedMonth,
        selectedYear,
        selectedDayDate,
        startDate,
        endDate,
      ),
    [activeTab, selectedMonth, selectedYear, selectedDayDate, startDate, endDate],
  )

  const activeReportData = useMemo<ReportPresetDataset>(() => {
    const activeRange = selectedRange

    const normalizedOrders = orders
      .map((order) => ({
        order,
        createdAt: resolveISOOrTimestamp(order.createdAt),
      }))
      .filter((entry): entry is { order: OrderDocument; createdAt: Date } => {
        return Boolean(entry.createdAt) && entry.order.status !== 'cancelled'
      })

    const currentOrders = normalizedOrders.filter(({ createdAt }) => {
      return createdAt >= activeRange.start && createdAt <= activeRange.end
    })

    const previousOrders = normalizedOrders.filter(({ createdAt }) => {
      return createdAt >= activeRange.previousStart && createdAt <= activeRange.previousEnd
    })

    const currentRevenue = currentOrders.reduce((sum, entry) => sum + entry.order.total, 0)
    const previousRevenue = previousOrders.reduce((sum, entry) => sum + entry.order.total, 0)
    const currentTotalOrders = currentOrders.length
    const previousTotalOrders = previousOrders.length
    const currentTicket = currentTotalOrders > 0 ? currentRevenue / currentTotalOrders : 0
    const previousTicket = previousTotalOrders > 0 ? previousRevenue / previousTotalOrders : 0

    const productCategoryById = new Map<string, string>()
    products.forEach((product) => {
      if (product.id) productCategoryById.set(product.id, product.category || 'Otros')
    })

    const dishMap: Record<string, { name: string; quantity: number; revenue: number }> = {}
    const categoryMap: Record<string, number> = {}

    currentOrders.forEach(({ order }) => {
      order.items.forEach((item) => {
        if (!dishMap[item.productId]) {
          dishMap[item.productId] = { name: item.name, quantity: 0, revenue: 0 }
        }

        dishMap[item.productId].quantity += item.quantity
        dishMap[item.productId].revenue += item.totalPrice

        const categoryName = productCategoryById.get(item.productId) || 'Otros'
        categoryMap[categoryName] = (categoryMap[categoryName] || 0) + item.totalPrice
      })
    })

    const topDishColors = ['#5db075', '#3f9660', '#86ca96', '#b4dfbf', '#d7f0dc']
    const dishesArray = Object.values(dishMap).sort((a, b) => b.revenue - a.revenue)
    const dishesRevenueTotal = dishesArray.reduce((acc, dish) => acc + dish.revenue, 0)

    const topDishes: ReportTopDish[] = dishesArray.slice(0, 5).map((dish, index) => ({
      position: index + 1,
      name: dish.name,
      orders: dish.quantity,
      revenue: dish.revenue,
      sharePercentage: dishesRevenueTotal > 0 ? (dish.revenue / dishesRevenueTotal) * 100 : 0,
      shareColor: topDishColors[index % topDishColors.length],
    }))

    const categoryColors = ['#1e40af', '#5db075', '#c2410c', '#8b5cf6', '#eab308']
    const categoryPerformance: CategoryPerformanceData[] = Object.keys(categoryMap)
      .sort((a, b) => categoryMap[b] - categoryMap[a])
      .map((category, index) => ({
        category,
        revenue: categoryMap[category],
        color: categoryColors[index % categoryColors.length],
      }))

    const includeDatePrefix = activeTab !== 'Día'
    const seriesTemplate =
      activeRange.seriesMode === 'month'
        ? createMonthSeriesTemplate(activeRange.start.getFullYear())
        : activeRange.seriesMode === 'hour'
          ? createHourSeriesTemplate(activeRange.start, activeRange.end, includeDatePrefix)
          : createDaySeriesTemplate(activeRange.start, activeRange.end)

    const revenueBySeriesKey: Record<string, number> = {}
    const ordersBySeriesKey: Record<string, number> = {}

    currentOrders.forEach(({ order, createdAt }) => {
      const seriesKey =
        activeRange.seriesMode === 'month'
          ? toMonthKey(createdAt.getFullYear(), createdAt.getMonth())
          : activeRange.seriesMode === 'hour'
            ? toHourKey(createdAt)
            : toDayKey(createdAt)

      revenueBySeriesKey[seriesKey] = (revenueBySeriesKey[seriesKey] || 0) + order.total
      ordersBySeriesKey[seriesKey] = (ordersBySeriesKey[seriesKey] || 0) + 1
    })

    const dailyRevenue = seriesTemplate.map((item) => ({
      date: item.key,
      label: item.label,
      revenue: revenueBySeriesKey[item.key] || 0,
    }))

    const dailyOrders = seriesTemplate.map((item) => ({
      date: item.key,
      label: item.label,
      orders: ordersBySeriesKey[item.key] || 0,
    }))

    const hourMap: Record<string, number> = {}
    currentOrders.forEach(({ createdAt }) => {
      const hourLabel = `${String(createdAt.getHours()).padStart(2, '0')}:00`
      hourMap[hourLabel] = (hourMap[hourLabel] || 0) + 1
    })

    const peakHours: PeakHourData[] = Array.from({ length: 24 }).map((_, index) => {
      const hourValue = index
      const hourLabel = `${String(hourValue).padStart(2, '0')}:00`

      return {
        time: hourLabel,
        orders: hourMap[hourLabel] || 0,
        isPeak: false,
      }
    })

    const sortedPeakHours = [...peakHours].sort((a, b) => b.orders - a.orders)
    if (sortedPeakHours[0]?.orders > 0) sortedPeakHours[0].isPeak = true
    if (sortedPeakHours[1]?.orders > 0) sortedPeakHours[1].isPeak = true

    return {
      rangeLabel: activeRange.rangeLabel,
      dateRange: {
        start: activeRange.start.toISOString(),
        end: activeRange.end.toISOString(),
      },
      metrics: [
        {
          id: 'revenue',
          label: 'Ingresos totales',
          value: formatCurrency(currentRevenue),
          change: formatSignedPercentage(currentRevenue, previousRevenue),
          changeType: getChangeType(currentRevenue, previousRevenue),
          changeLabel: 'vs periodo anterior',
        },
        {
          id: 'orders',
          label: 'Pedidos',
          value: currentTotalOrders.toString(),
          change: formatSignedPercentage(currentTotalOrders, previousTotalOrders),
          changeType: getChangeType(currentTotalOrders, previousTotalOrders),
          changeLabel: 'vs periodo anterior',
        },
        {
          id: 'ticket',
          label: 'Ticket Promedio',
          value: formatCurrency(currentTicket),
          change: formatSignedPercentage(currentTicket, previousTicket),
          changeType: getChangeType(currentTicket, previousTicket),
          changeLabel: 'vs periodo anterior',
        },
        {
          id: 'growth',
          label: 'Avance del periodo',
          value: formatSignedPercentage(currentRevenue, previousRevenue),
          change: `${currentTotalOrders} pedidos analizados`,
          changeType: getChangeType(currentRevenue, previousRevenue),
          changeLabel: 'movimiento actual',
        },
      ],
      dailyRevenue,
      dailyOrders,
      categoryPerformance,
      peakHours,
      topDishes,
    }
  }, [activeTab, orders, products, selectedRange])

  const handleTabChange = (tab: ReportsTabFilter) => setActiveTab(tab)

  const peakHoursSummary =
    activeReportData.peakHours.length > 0
      ? `Las franjas mas concurridas son alrededor de las ${activeReportData.peakHours.find((hour) => hour.isPeak)?.time || '--:--'}.`
      : 'No hay datos suficientes para identificar horas pico.'

  const seriesLabelForTitle =
    selectedRange.seriesMode === 'hour'
      ? 'hora'
      : selectedRange.seriesMode === 'month'
        ? 'mes'
        : 'día'

  const seriesLabelForTooltip =
    selectedRange.seriesMode === 'hour'
      ? 'Hora'
      : selectedRange.seriesMode === 'month'
        ? 'Mes'
        : 'Fecha'

  const isHourlyView = selectedRange.seriesMode === 'hour'
  const axisInterval: number | 'preserveStartEnd' = isHourlyView
    ? Math.max(0, Math.floor(activeReportData.dailyRevenue.length / 12) - 1)
    : 'preserveStartEnd'

  return (
    <section className="reportsManagementTab" aria-label="Gestion de reportes analiticos">
      <header className="reportsManagementTab__header">
        <div className="reportsManagementTab__headerTop">
          <div>
            <h2 className="reportsManagementTab__title">Reportes</h2>
            <p className="reportsManagementTab__subtitle">
              Sincronizado en tiempo real con datos en vivo.
            </p>
          </div>

          <div
            className="reportsManagementTab__filters"
            role="tablist"
            aria-label="Filtros de periodo de reporte"
          >
            {reportTimeFilters.map((tabId) => (
              <button
                key={tabId}
                role="tab"
                aria-selected={activeTab === tabId}
                className={`reportsManagementTab__filterBtn ${activeTab === tabId ? 'reportsManagementTab__filterBtn--active' : ''}`}
                onClick={() => handleTabChange(tabId)}
              >
                {tabId}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'Día' && (
          <div className="reportsManagementTab__rangeControls" aria-label="Filtro por día">
            <label className="reportsManagementTab__control" htmlFor="report-day">
              Día
              <input
                id="report-day"
                type="date"
                value={selectedDayDate}
                onChange={(event) => setSelectedDayDate(event.target.value)}
              />
            </label>
          </div>
        )}

        {activeTab === 'Mes' && (
          <div className="reportsManagementTab__rangeControls" aria-label="Filtros por mes y año">
            <label className="reportsManagementTab__control">
              Mes
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(Number(event.target.value))}
              >
                {monthLabels.map((monthName, monthIndex) => (
                  <option key={monthName} value={monthIndex}>
                    {monthName}
                  </option>
                ))}
              </select>
            </label>

            <label className="reportsManagementTab__control">
              Año
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
              >
                {availableYears.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {activeTab === 'Año' && (
          <div className="reportsManagementTab__rangeControls" aria-label="Filtro por año">
            <label className="reportsManagementTab__control">
              Año
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
              >
                {availableYears.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {activeTab === 'Personalizado' && (
          <div className="reportsManagementTab__customRange">
            <div className="reportsManagementTab__control">
              <label htmlFor="custom-start">Desde</label>
              <input
                id="custom-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="reportsManagementTab__control">
              <label htmlFor="custom-end">Hasta</label>
              <input
                id="custom-end"
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </header>

      <section className="reportsManagementTab__metrics" aria-label="Resumen de indicadores">
        {activeReportData.metrics.map((metric) => (
          <article key={metric.id} className="reportMetricCard">
            <h3 className="reportMetricCard__label">{metric.label}</h3>
            <p className="reportMetricCard__value">{metric.value}</p>
            <p
              className={`reportMetricCard__change reportMetricCard__change--${metric.changeType}`}
            >
              <strong>{metric.change}</strong>
              <span>{metric.changeLabel}</span>
            </p>
          </article>
        ))}
      </section>

      <section className="reportsManagementTab__chartsGrid" aria-label="Graficos detallados">
        <article className="panelCard reportsChartCard">
          <header className="panelCard__header">
            <h3 className="panelCard__title">Ingresos por {seriesLabelForTitle}</h3>
            <span className="panelCard__chip">{activeReportData.rangeLabel}</span>
          </header>

          <div className="reportsChartCard__canvas" aria-label="Grafico de ingresos">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeReportData.dailyRevenue} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e4ece7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#76877c' }} interval={axisInterval} />
                <YAxis tick={{ fontSize: 11, fill: '#76877c' }} tickFormatter={formatAxisCurrency} width={62} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Ingresos']}
                  labelFormatter={(label) => `${seriesLabelForTooltip}: ${String(label ?? '')}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#86ca96"
                  strokeWidth={3}
                  dot={{ r: 2.5, fill: '#86ca96', strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panelCard reportsChartCard">
          <header className="panelCard__header">
            <h3 className="panelCard__title">Pedidos por {seriesLabelForTitle}</h3>
            <span className="panelCard__chip">{activeReportData.rangeLabel}</span>
          </header>

          <div className="reportsChartCard__canvas" aria-label="Grafico de pedidos">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeReportData.dailyOrders} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e4ece7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#76877c' }} interval={axisInterval} />
                <YAxis tick={{ fontSize: 11, fill: '#76877c' }} width={36} />
                <Tooltip
                  formatter={(value) => [new Intl.NumberFormat('es-CO').format(Number(value ?? 0)), 'Pedidos']}
                  labelFormatter={(label) => `${seriesLabelForTooltip}: ${String(label ?? '')}`}
                />
                <Bar dataKey="orders" fill="#69bf63" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="reportsChartCard__footnote">
            {isHourlyView
              ? 'Vista por hora activada para mostrar subidas y bajadas dentro del periodo.'
              : 'Incluye solo ordenes validas dentro del rango seleccionado.'}
          </p>
        </article>

        <article className="panelCard reportsChartCard">
          <header className="panelCard__header">
            <h3 className="panelCard__title">Horas pico</h3>
            <span className="panelCard__chip">{activeReportData.rangeLabel}</span>
          </header>

          <div className="reportsChartCard__canvas" aria-label="Grafico de horas pico">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeReportData.peakHours} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e4ece7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#76877c' }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#76877c' }} width={36} />
                <Tooltip
                  formatter={(value) => [new Intl.NumberFormat('es-CO').format(Number(value ?? 0)), 'Pedidos']}
                  labelFormatter={(label) => `Hora: ${String(label ?? '')}`}
                />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                  {activeReportData.peakHours.map((hour) => (
                    <Cell key={hour.time} fill={hour.isPeak ? '#67b26b' : '#9ddba3'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="reportsChartCard__footnote">🔥 {peakHoursSummary}</p>
        </article>

        <article className="panelCard reportsChartCard">
          <header className="panelCard__header">
            <h3 className="panelCard__title">Rendimiento por categoria</h3>
            <span className="panelCard__chip">{activeReportData.rangeLabel}</span>
          </header>

          <div className="reportsChartCard__canvas" aria-label="Grafico de rendimiento por categoria">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={activeReportData.categoryPerformance}
                margin={{ top: 10, right: 14, left: 22, bottom: 0 }}
              >
                <CartesianGrid stroke="#e4ece7" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#76877c' }} tickFormatter={formatAxisCurrency} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#76877c' }} width={76} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Ingresos']}
                  labelFormatter={(label) => `Categoria: ${String(label ?? '')}`}
                />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                  {activeReportData.categoryPerformance.map((category) => (
                    <Cell key={category.category} fill={category.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {activeReportData.categoryPerformance.length === 0 && (
            <p className="reportsChartCard__footnote">Sin categorias con ventas registradas en este periodo.</p>
          )}
        </article>
      </section>

      <section className="reportsManagementTab__topDishes panelCard" aria-label="Top platos por ingresos">
        <header className="panelCard__header">
          <h3 className="panelCard__title">Top platos por ingresos</h3>
          <span className="panelCard__chip">{activeReportData.rangeLabel}</span>
        </header>

        <div className="reportsTopDishesTable">
          <div className="reportsTopDishesTable__head">
            <span>Posicion</span>
            <span>Plato</span>
            <span>Pedidos</span>
            <span>Ingresos</span>
            <span>Participacion</span>
          </div>

          {activeReportData.topDishes.length > 0 ? (
            activeReportData.topDishes.map((dish) => (
              <article key={dish.position} className="reportsTopDishesTable__row">
                <span className="reportsTopDishesTable__position">{dish.position}</span>
                <span className="reportsTopDishesTable__name">{dish.name}</span>
                <span>{dish.orders} uds</span>
                <strong>{formatCurrency(dish.revenue)}</strong>
                <div className="reportsTopDishesTable__share">
                  <div className="reportsTopDishesTable__shareTrack" aria-hidden>
                    <span
                      style={{ width: `${dish.sharePercentage}%`, backgroundColor: dish.shareColor }}
                    />
                  </div>
                  <small>{dish.sharePercentage.toFixed(1)}%</small>
                </div>
              </article>
            ))
          ) : (
            <p className="reportsTopDishesTable__empty">
              No hay datos registrados de consumo cruzado en este margen temporal.
            </p>
          )}
        </div>
      </section>
    </section>
  )
}
