// Importa tipo de plato destacado para ranking.
import type { TopDish } from '../adminDashboard/adminDashboard.types'
// Importa estilos visuales del panel de top platos.
import './topDishesPanel.css'

// Define props esperadas por el panel de ranking.
interface TopDishesPanelProps {
  // Lista de platos con pedidos e ingresos para visualizacion.
  dishes: TopDish[]
}

// Renderiza ranking de platos mas vendidos con barra de progreso.
export default function TopDishesPanel({ dishes }: TopDishesPanelProps) {
  // Obtiene el valor maximo para normalizar el ancho de barras.
  const maxOrders = Math.max(...dishes.map((dish) => dish.orders), 1)

  // Dibuja lista ordenada con progreso relativo por plato.
  return (
    <article className="topDishesPanel panelCard">
      <header className="panelCard__header">
        <h2 className="panelCard__title">Platos mas vendidos</h2>
      </header>

      <ol className="topDishesPanel__list" aria-label="Ranking de platos">
        {dishes.map((dish, index) => {
          // Calcula porcentaje de barra con base en el maximo.
          const widthPercentage = (dish.orders / maxOrders) * 100

          // Renderiza item individual del ranking.
          return (
            <li key={dish.id} className="topDishesPanel__item">
              <span className="topDishesPanel__rank">{index + 1}</span>

              <div className="topDishesPanel__body">
                <div className="topDishesPanel__head">
                  <p className="topDishesPanel__name">{dish.name}</p>
                  <strong className="topDishesPanel__revenue">{dish.revenue}</strong>
                </div>

                <div className="topDishesPanel__track" aria-hidden>
                  <span className="topDishesPanel__progress" style={{ width: `${widthPercentage}%` }} />
                </div>

                <p className="topDishesPanel__meta">{dish.orders} pedido{dish.orders > 1 ? 's' : ''}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </article>
  )
}
