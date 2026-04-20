// Importa estado y memo para filtros de periodos del tab reportes.
import { useMemo, useState } from 'react'
// Importa componentes de Recharts para todos los graficos de esta pestaña.
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
// Importa tipos del dashboard para mantener contratos fuertemente tipados.
import type {
  CategoryPerformanceData,
  PeakHourData,
  ReportDailyPerformance,
  ReportMetric,
  ReportPresetDataset,
  ReportPresetFilter,
  ReportTimeFilter,
  ReportTopDish,
} from '../adminDashboard/adminDashboard.types'
// Importa estilos dedicados de la pestaña de reportes.
import './reportsManagementTab.css'

// Define las props del modulo de reportes.
interface ReportsManagementTabProps {
  // Snapshots estaticos para Semana, Mes y Año.
  presetData: Record<ReportPresetFilter, ReportPresetDataset>
  // Dataset diario semilla para construir rango personalizado.
  customSeedData: ReportDailyPerformance[]
}

// Define el orden visual de filtros de periodo.
const reportTimeFilters: ReportTimeFilter[] = ['Semana', 'Mes', 'Año', 'Personalizado']

// Limita un valor numerico dentro de un rango.
const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max)

// Formatea montos monetarios para tarjetas y tabla.
const formatCurrency = (value: number): string =>
  `COP ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value)}`

// Formatea moneda compacta para ejes de graficos.
const formatAxisCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `COP ${(value / 1_000_000).toFixed(1)}M`
  }

  if (value >= 1_000) {
    return `COP ${(value / 1_000).toFixed(0)}k`
  }

  return `COP ${value.toLocaleString('es-CO')}`
}

// Formatea porcentaje con signo para variaciones.
const formatSignedPercentage = (currentValue: number, previousValue: number): string => {
  if (previousValue <= 0) {
    return '+0.0%'
  }

  const change = ((currentValue - previousValue) / previousValue) * 100
  const sign = change >= 0 ? '+' : '-'
  return `${sign}${Math.abs(change).toFixed(1)}%`
}

// Formatea etiqueta de fecha para mostrar en rango personalizado.
const formatDateForLabel = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-')

  if (!year || !month || !day) {
    return isoDate
  }

  return `${day}/${month}/${year}`
}

// Crea una metrica tipada para las tarjetas superiores.
const buildReportMetric = (
  id: string,
  label: string,
  value: string,
  change: string,
  changeLabel: string,
): ReportMetric => {
  const changeType: ReportMetric['changeType'] = change.startsWith('-') ? 'negative' : 'positive'

  return {
    id,
    label,
    value,
    change,
    changeType,
    changeLabel,
  }
}

// Escala horas pico para que personalizado tambien actualice ese panel.
const scalePeakHours = (peakHours: PeakHourData[], scaleFactor: number): PeakHourData[] =>
  peakHours.map((hour) => ({
    ...hour,
    orders: Math.max(1, Math.round(hour.orders * (0.58 + scaleFactor * 0.42))),
  }))

// Escala ingresos por categoria para el rango personalizado.
const scaleCategories = (
  categories: CategoryPerformanceData[],
  scaleFactor: number,
): CategoryPerformanceData[] =>
  categories.map((category) => ({
    ...category,
    revenue: Math.max(1000, Math.round(category.revenue * scaleFactor)),
  }))

// Escala top platos y recalcula participacion porcentual.
const scaleTopDishes = (topDishes: ReportTopDish[], scaleFactor: number): ReportTopDish[] => {
  const scaled = topDishes.map((dish) => ({
    ...dish,
    orders: Math.max(1, Math.round(dish.orders * scaleFactor)),
    revenue: Math.max(100, Math.round(dish.revenue * scaleFactor)),
  }))

  const totalRevenue = scaled.reduce((accumulator, dish) => accumulator + dish.revenue, 0)

  return scaled.map((dish) => ({
    ...dish,
    sharePercentage: Number(((dish.revenue / Math.max(totalRevenue, 1)) * 100).toFixed(1)),
  }))
}

// Construye snapshot dinamico para el filtro personalizado.
const buildCustomPresetDataset = (
  startDate: string,
  endDate: string,
  customSeedData: ReportDailyPerformance[],
  monthPreset: ReportPresetDataset,
): ReportPresetDataset => {
  if (customSeedData.length === 0) {
    return monthPreset
  }

  const normalizedStart = startDate <= endDate ? startDate : endDate
  const normalizedEnd = startDate <= endDate ? endDate : startDate

  const selectedRecords = customSeedData.filter(
    (record) => record.date >= normalizedStart && record.date <= normalizedEnd,
  )

  const fallbackRecords = selectedRecords.length > 0 ? selectedRecords : customSeedData.slice(-8)

  const currentRevenue = fallbackRecords.reduce((accumulator, record) => accumulator + record.revenue, 0)
  const currentOrders = fallbackRecords.reduce((accumulator, record) => accumulator + record.orders, 0)
  const currentAverageTicket = currentOrders > 0 ? currentRevenue / currentOrders : 0
  const currentConversion =
    fallbackRecords.reduce((accumulator, record) => accumulator + record.conversionRate, 0) /
    Math.max(fallbackRecords.length, 1)

  const currentStartIndex = customSeedData.findIndex((record) => record.date === fallbackRecords[0].date)
  const periodLength = fallbackRecords.length
  const previousPeriodStart = Math.max(0, currentStartIndex - periodLength)
  const previousRecords = customSeedData.slice(previousPeriodStart, currentStartIndex)
  const comparisonRecords = previousRecords.length > 0 ? previousRecords : fallbackRecords

  const previousRevenue = comparisonRecords.reduce((accumulator, record) => accumulator + record.revenue, 0)
  const previousOrders = comparisonRecords.reduce((accumulator, record) => accumulator + record.orders, 0)
  const previousAverageTicket = previousOrders > 0 ? previousRevenue / previousOrders : currentAverageTicket
  const previousConversion =
    comparisonRecords.reduce((accumulator, record) => accumulator + record.conversionRate, 0) /
    Math.max(comparisonRecords.length, 1)

  const scaleFactor = clamp(
    currentRevenue /
      Math.max(
        monthPreset.dailyRevenue.reduce((accumulator, point) => accumulator + point.revenue, 0),
        1,
      ),
    0.35,
    1.75,
  )

  return {
    rangeLabel: `Personalizado (${formatDateForLabel(normalizedStart)} - ${formatDateForLabel(normalizedEnd)})`,
    dateRange: {
      start: normalizedStart,
      end: normalizedEnd,
    },
    metrics: [
      buildReportMetric(
        'custom-revenue',
        'Ingresos totales',
        formatCurrency(currentRevenue),
        formatSignedPercentage(currentRevenue, previousRevenue),
        'vs periodo anterior',
      ),
      buildReportMetric(
        'custom-orders',
        'Total pedidos',
        new Intl.NumberFormat('es-CO').format(currentOrders),
        formatSignedPercentage(currentOrders, previousOrders),
        'vs periodo anterior',
      ),
      buildReportMetric(
        'custom-ticket',
        'Ticket promedio',
        formatCurrency(Math.round(currentAverageTicket)),
        formatSignedPercentage(currentAverageTicket, previousAverageTicket),
        'por pedido',
      ),
      buildReportMetric(
        'custom-conversion',
        'Tasa conversion',
        `${currentConversion.toFixed(1)}%`,
        formatSignedPercentage(currentConversion, previousConversion),
        'carrito -> compra',
      ),
    ],
    dailyRevenue: fallbackRecords.map((record) => ({
      date: record.date,
      label: record.label,
      revenue: record.revenue,
    })),
    dailyOrders: fallbackRecords.map((record) => ({
      date: record.date,
      label: record.label,
      orders: record.orders,
    })),
    peakHours: scalePeakHours(monthPreset.peakHours, scaleFactor),
    categoryPerformance: scaleCategories(monthPreset.categoryPerformance, scaleFactor),
    topDishes: scaleTopDishes(monthPreset.topDishes, scaleFactor),
  }
}

// Renderiza la pestaña completa de reportes con filtros por periodo y graficos Recharts.
export default function ReportsManagementTab({ presetData, customSeedData }: ReportsManagementTabProps) {
  // Guarda periodo activo para redibujar toda la pestaña de reportes.
  const [activeTimeFilter, setActiveTimeFilter] = useState<ReportTimeFilter>('Semana')

  // Define rango inicial del filtro personalizado.
  const [customStartDate, setCustomStartDate] = useState<string>(
    customSeedData[0]?.date ?? presetData.Mes.dateRange.start,
  )
  const [customEndDate, setCustomEndDate] = useState<string>(
    customSeedData[customSeedData.length - 1]?.date ?? presetData.Mes.dateRange.end,
  )

  const customMinDate = customSeedData[0]?.date ?? presetData.Mes.dateRange.start
  const customMaxDate =
    customSeedData[customSeedData.length - 1]?.date ?? presetData.Mes.dateRange.end

  // Selecciona snapshot segun filtro activo; personalizado se calcula en runtime.
  const activeReportData = useMemo<ReportPresetDataset>(() => {
    if (activeTimeFilter === 'Personalizado') {
      return buildCustomPresetDataset(customStartDate, customEndDate, customSeedData, presetData.Mes)
    }

    return presetData[activeTimeFilter as ReportPresetFilter]
  }, [activeTimeFilter, customEndDate, customSeedData, customStartDate, presetData])

  // Resume horas pico para mostrar una leyenda rapida.
  const peakHoursSummary = useMemo(() => {
    const peaks = activeReportData.peakHours.filter((hour) => hour.isPeak).map((hour) => hour.time)

    if (peaks.length === 0) {
      return 'Sin horas pico destacadas en este rango'
    }

    return `Horas pico: ${peaks.join(' / ')}`
  }, [activeReportData.peakHours])

  // Renderiza dashboard completo de reportes.
  return (
    <section className="reportsManagementTab" aria-label="Reportes y analisis">
      <header className="reportsManagementTab__topActions">
        <div className="reportsManagementTab__periodFilters" role="tablist" aria-label="Filtros de periodo">
          {reportTimeFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeTimeFilter === filter}
              className={`reportsManagementTab__periodButton ${
                activeTimeFilter === filter ? 'is-active' : ''
              }`}
              onClick={() => setActiveTimeFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <button type="button" className="reportsManagementTab__exportButton">
          ⭳ Exportar
        </button>
      </header>

      {activeTimeFilter === 'Personalizado' ? (
        <div className="reportsManagementTab__customRange panelCard" aria-label="Rango personalizado">
          <label>
            Desde
            <input
              type="date"
              min={customMinDate}
              max={customMaxDate}
              value={customStartDate}
              onChange={(event) => setCustomStartDate(event.target.value)}
            />
          </label>

          <label>
            Hasta
            <input
              type="date"
              min={customMinDate}
              max={customMaxDate}
              value={customEndDate}
              onChange={(event) => setCustomEndDate(event.target.value)}
            />
          </label>

          <p>
            Rango activo: {formatDateForLabel(activeReportData.dateRange.start)} -{' '}
            {formatDateForLabel(activeReportData.dateRange.end)}
          </p>
        </div>
      ) : null}

      <section className="reportsManagementTab__metrics" aria-label="Metricas principales de reportes">
        {activeReportData.metrics.map((metric) => (
          <article key={metric.id} className="reportsMetricCard panelCard">
            <p className="reportsMetricCard__value">{metric.value}</p>
            <p className="reportsMetricCard__label">{metric.label}</p>
            <p className={`reportsMetricCard__change reportsMetricCard__change--${metric.changeType}`}>
              {metric.change} {metric.changeLabel}
            </p>
          </article>
        ))}
      </section>

      <section className="reportsManagementTab__chartsGrid" aria-label="Graficos de reportes">
        <article className="panelCard reportsChartCard">
          <header className="panelCard__header">
            <h3 className="panelCard__title">Ingresos diarios</h3>
            <span className="panelCard__chip">{activeReportData.rangeLabel}</span>
          </header>

          <div className="reportsChartCard__canvas" aria-label="Grafico de ingresos diarios">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeReportData.dailyRevenue} margin={{ top: 10, right: 16, left: 6, bottom: 0 }}>
                <CartesianGrid stroke="#e4ece7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#76877c' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#76877c' }} tickFormatter={formatAxisCurrency} width={52} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Ingresos']}
                  labelFormatter={(label) => `Fecha: ${String(label ?? '')}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4aa85a"
                  strokeWidth={2.6}
                  dot={{ r: 2, fill: '#4aa85a' }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panelCard reportsChartCard">
          <header className="panelCard__header">
            <h3 className="panelCard__title">Pedidos diarios</h3>
            <span className="panelCard__chip">{activeReportData.rangeLabel}</span>
          </header>

          <div className="reportsChartCard__canvas" aria-label="Grafico de pedidos diarios">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeReportData.dailyOrders} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e4ece7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#76877c' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: '#76877c' }} width={36} />
                <Tooltip
                  formatter={(value) => [new Intl.NumberFormat('es-CO').format(Number(value ?? 0)), 'Pedidos']}
                  labelFormatter={(label) => `Fecha: ${String(label ?? '')}`}
                />
                <Bar dataKey="orders" fill="#69bf63" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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

          {activeReportData.topDishes.map((dish) => (
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
          ))}
        </div>
      </section>
    </section>
  )
}
