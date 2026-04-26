import type { ClientCartViewProps } from './clientCartView.types'
import './clientCartView.css'

const formatCOP = (amount: number): string => `COP ${amount.toLocaleString('es-CO')}`

export default function ClientCartView({
  items,
  onAddMoreDishes,
  onUpdateQuantity,
  onRemoveItem,
  promoCode,
  onPromoCodeChange,
  onApplyPromoCode,
  onProceedToCheckout,
  discountAmount,
  isFreeShipping,
}: ClientCartViewProps) {
  // Calculamos el subtotal base
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  // Calculamos el envio gratis siempre para demo
  const shipping = isFreeShipping ? 0 : 5000 // Supongamos 5000 COP por defecto
  const total = Math.max(0, subtotal - discountAmount) + shipping

  if (items.length === 0) {
    return (
      <div className="clientCartView clientCartView--empty">
        <div className="clientCartView__emptyState">
          <div className="clientCartView__emptyIcon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Descubre nuestros platos fitness y empieza a armar tu pedido perfecto.</p>
          <button
            type="button"
            className="clientCartView__exploreBtn"
            onClick={onAddMoreDishes}
          >
            Explorar menú &rarr;
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="clientCartView">
      <div className="clientCartView__content">
        <header className="clientCartView__header">
          <h1>Mi carrito</h1>
          <p>{items.length} productos</p>
        </header>

        <div className="clientCartView__layout">
          <div className="clientCartView__list">
            {items.map((item) => (
              <article key={item.id} className="clientCartView__item">
                <div className="clientCartView__itemImage">
                  <span className="clientCartView__itemEmoji" aria-hidden>{item.emoji}</span>
                </div>
                <div className="clientCartView__itemDetails">
                  <div className="clientCartView__itemHeader">
                    <h3>{item.name}</h3>
                    <button
                      type="button"
                      className="clientCartView__deleteBtn"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Eliminar ${item.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="clientCartView__itemSubtext">{item.subtext}</p>
                  
                  <div className="clientCartView__itemFooter">
                    <div className="clientCartView__quantityControls">
                      <button
                        type="button"
                        className="clientCartView__qtyBtn clientCartView__qtyBtn--minus"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="clientCartView__qtyValue">{item.quantity}</span>
                      <button
                        type="button"
                        className="clientCartView__qtyBtn clientCartView__qtyBtn--plus"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="clientCartView__itemPrice">
                      {formatCOP(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            <button
              type="button"
              className="clientCartView__addMoreBtn"
              onClick={onAddMoreDishes}
            >
              + Agregar más platos
            </button>
          </div>

          <aside className="clientCartView__summary">
            <h2>Resumen del pedido</h2>
            
            <div className="clientCartView__promo">
              <label htmlFor="promoInput">Código de descuento</label>
              <div className="clientCartView__promoForm">
                <input
                  id="promoInput"
                  type="text"
                  placeholder="FIT10"
                  value={promoCode}
                  onChange={(e) => onPromoCodeChange(e.target.value)}
                />
                <button type="button" onClick={onApplyPromoCode}>
                  Aplicar
                </button>
              </div>
              <p className="clientCartView__promoHint">
                Prueba: FIT10, PRIMERA10, ENVIOGRATIS
              </p>
            </div>

            <div className="clientCartView__summaryTotals">
              <div className="clientCartView__summaryRow">
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="clientCartView__summaryRow" style={{color: 'green'}}>
                  <span>Descuento</span>
                  <span>-{formatCOP(discountAmount)}</span>
                </div>
              )}
              <div className="clientCartView__summaryRow">
                <span>Envío</span>
                <span className="clientCartView__summaryFree">{isFreeShipping ? '¡Gratis!' : formatCOP(shipping)}</span>
              </div>
              <div className="clientCartView__summaryRow clientCartView__summaryRow--total">
                <span>Total</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>

            <button
              type="button"
              className="clientCartView__checkoutBtn"
              onClick={onProceedToCheckout}
            >
              Proceder al pago &rarr; {formatCOP(total)}
            </button>

            <div className="clientCartView__securityNotes">
              <span>🔒 Pago seguro</span>
              <span>•</span>
              <span>✓ Sin cargos ocultos</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}