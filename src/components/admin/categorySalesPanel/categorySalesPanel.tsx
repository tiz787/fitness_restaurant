// Importa tipo para distribucion de ventas por categoria.
import type { CategoryDistribution } from '../adminDashboard/adminDashboard.types'
// Importa primitives de Recharts para grafico de dona.
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
// Importa estilos del panel de dona y leyenda.
import './categorySalesPanel.css'

// Define props del panel de categoria.
interface CategorySalesPanelProps {
  // Lista de categorias con porcentaje y color.
  categories: CategoryDistribution[]
}

// Renderiza panel de participacion de ventas por categoria.
export default function CategorySalesPanel({ categories }: CategorySalesPanelProps) {
  // Adapta estructura para que Recharts use llaves simples y claras.
  const chartData = categories.map((category) => ({
    id: category.id,
    label: category.label,
    percentage: category.percentage,
    color: category.color,
  }))

  // Renderiza componente de dona y su leyenda asociada.
  return (
    <article className="categorySalesPanel panelCard">
      <header className="panelCard__header">
        <h2 className="panelCard__title">Ventas por categoria</h2>
      </header>

      <div className="categorySalesPanel__layout">
        <div className="categorySalesPanel__donut" aria-label="Distribucion de ventas por categoria">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="percentage"
                nameKey="label"
                innerRadius="58%"
                outerRadius="88%"
                paddingAngle={1}
                stroke="none"
              >
                {chartData.map((category) => (
                  <Cell key={category.id} fill={category.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0)}%`, 'Participacion']}
                labelFormatter={(label) => `Categoria: ${String(label ?? '')}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="categorySalesPanel__legend" aria-label="Distribucion por categoria">
          {categories.map((category) => (
            <li key={category.id}>
              <span
                className="categorySalesPanel__dot"
                style={{ backgroundColor: category.color }}
                aria-hidden
              />
              <span className="categorySalesPanel__name">{category.label}</span>
              <strong className="categorySalesPanel__percentage">{category.percentage}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
