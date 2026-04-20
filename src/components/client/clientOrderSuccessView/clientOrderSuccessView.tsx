import type { ClientOrderSuccessViewProps } from './clientOrderSuccessView.types'
import './clientOrderSuccessView.css'

const formatCOP = (amount: number): string => `COP ${amount.toLocaleString('es-CO')}`

export default function ClientOrderSuccessView({
  orderInfo,
  onBackToHome,
  onTrackOrder,
}: ClientOrderSuccessViewProps) {
  if (!orderInfo) return null

  return (
    <div className="clientOrderSuccessView">
      <div className="clientOrderSuccessView__container">
        
        <div className="successView__iconWrapper">
          <div className="successView__icon" aria-hidden>✓</div>
        </div>

        <h1 className="successView__title">¡Pedido confirmado!</h1>
        <p className="successView__subtitle">Tu pedido ha sido recibido</p>
        
        <p className="successView__orderId">{orderInfo.id}</p>

        <div className="successView__detailsCard">
          <div className="successView__detailRow">
            <span className="successView__label">Método de entrega</span>
            <span className="successView__value">
              {orderInfo.deliveryMethod === 'delivery' ? '🚴 Delivery' : '🏪 Retiro en local'}
            </span>
          </div>
          <div className="successView__detailRow">
            <span className="successView__label">Tiempo estimado</span>
            <span className="successView__value">{orderInfo.estimatedMinutes} minutos</span>
          </div>
          <div className="successView__detailRow">
            <span className="successView__label">Total pagado</span>
            <span className="successView__value successView__value--price">
              {formatCOP(orderInfo.totalPaid)}
            </span>
          </div>
        </div>

        <div className="successView__actions">
          <button 
            type="button" 
            className="successView__trackBtn"
            onClick={onTrackOrder}
          >
            Seguir mi pedido &rarr;
          </button>
          
          <button 
            type="button" 
            className="successView__homeBtn"
            onClick={onBackToHome}
          >
            Volver al inicio
          </button>
        </div>

      </div>
    </div>
  )
}