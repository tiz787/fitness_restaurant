// Importa tipo de punto para la serie de ventas.
import type { SalesTrendPoint } from '../adminDashboard/adminDashboard.types'
// Importa primitives de Recharts para grafico de linea.
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
// Importa estilos dedicados del panel de tendencia.
import './salesTrendPanel.css'

// Define props esperadas por el panel de grafico de ventas.
interface SalesTrendPanelProps {
  // Lista de puntos para dibujar la curva de tendencia.
  points: SalesTrendPoint[]
}

// Formatea ticks monetarios del eje Y.
const formatCurrencyTick = (value: number): string => {
  if (value >= 1000) {
    return `COP ${(value / 1000).toFixed(0)}k`
  }

  return `COP ${value.toLocaleString('es-CO')}`
}

// Renderiza panel de tendencia de ventas ultimos dias.
export default function SalesTrendPanel({ points }: SalesTrendPanelProps) {
  // Muestra estado vacio si no hay datos estaticos cargados.
  if (points.length === 0) {
    return (
      <article className="salesTrendPanel panelCard">
        <header className="panelCard__header">
          <h2 className="panelCard__title">Ventas ultimos 8 dias</h2>
        </header>
        <p className="salesTrendPanel__empty">No hay datos disponibles aun.</p>
      </article>
    )
  }

  // Renderiza grafico lineal y etiquetas de fechas.
  return (
    <article className="salesTrendPanel panelCard">
      <header className="panelCard__header">
        <h2 className="panelCard__title">Ventas ultimos 8 dias</h2>
        <span className="panelCard__chip">Ultimos 7 dias</span>
      </header>

      <div className="salesTrendPanel__chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#dfe8e3" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6d8377' }} />
            <YAxis
              tick={{ fontSize: 11, fill: '#6d8377' }}
              tickFormatter={formatCurrencyTick}
              width={46}
            />
            <Tooltip
              formatter={(value) => [formatCurrencyTick(Number(value ?? 0)), 'Ingresos']}
              labelFormatter={(label) => `Dia: ${String(label ?? '')}`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#41a961"
              strokeWidth={2.8}
              dot={{ r: 2.2, fill: '#41a961' }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
