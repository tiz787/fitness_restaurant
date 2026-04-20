import { useState } from 'react'
import type { ClientCheckoutViewProps } from './clientCheckoutView.types'
import './clientCheckoutView.css'

type CheckoutStep = 'delivery' | 'payment' | 'confirm'
type DeliveryMethod = 'delivery' | 'pickup'
type PaymentMethod = 'card' | 'cash' | 'transfer'

const formatCOP = (amount: number): string => `COP ${amount.toLocaleString('es-CO')}`

export default function ClientCheckoutView({
  items,
  onBackToCart,
  onConfirmOrder,
}: ClientCheckoutViewProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery')

  // Datos de entrega.
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [address, setAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')

  // Datos de pago.
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  // Resumen monetario.
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = deliveryMethod === 'delivery' ? 0 : 0
  const total = subtotal + shipping

  const handleNextStep = (next: CheckoutStep): void => {
    setCurrentStep(next)
  }

  const handlePrevStep = (prev: CheckoutStep | 'cart'): void => {
    if (prev === 'cart') {
      onBackToCart()
      return
    }

    setCurrentStep(prev)
  }

  return (
    <div className="clientCheckoutView">
      <div className="clientCheckoutView__content">
        <header className="clientCheckoutView__header">
          <h1>Finalizar pedido</h1>
          <div className="clientCheckoutView__stepper">
            <button
              type="button"
              className={`stepper__btn ${
                currentStep === 'delivery' || currentStep === 'payment' || currentStep === 'confirm'
                  ? 'is-active'
                  : ''
              }`}
              onClick={() => setCurrentStep('delivery')}
            >
              <span className="stepper__icon">📍</span> Entrega
            </button>
            <span className="stepper__divider">&rsaquo;</span>
            <button
              type="button"
              className={`stepper__btn ${
                currentStep === 'payment' || currentStep === 'confirm' ? 'is-active' : ''
              }`}
              onClick={currentStep !== 'delivery' ? () => setCurrentStep('payment') : undefined}
            >
              <span className="stepper__icon">💳</span> Pago
            </button>
            <span className="stepper__divider">&rsaquo;</span>
            <button
              type="button"
              className={`stepper__btn ${currentStep === 'confirm' ? 'is-active' : ''}`}
              onClick={currentStep === 'confirm' ? () => setCurrentStep('confirm') : undefined}
            >
              <span className="stepper__icon">✓</span> Confirmar
            </button>
          </div>
        </header>

        <div className="clientCheckoutView__layout">
          <main className="clientCheckoutView__main">
            {currentStep === 'delivery' && (
              <section className="checkoutPanel">
                <h2 className="checkoutPanel__title">Metodo de entrega</h2>
                <div className="checkoutPanel__methodsRow">
                  <label className={`methodCard ${deliveryMethod === 'delivery' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={() => setDeliveryMethod('delivery')}
                    />
                    <span className="methodCard__icon" aria-hidden>
                      🚴
                    </span>
                    <span className="methodCard__name">Delivery</span>
                    <span className="methodCard__desc">30-40 min</span>
                    <span className="methodCard__tag">Gratis</span>
                  </label>

                  <label className={`methodCard ${deliveryMethod === 'pickup' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                    />
                    <span className="methodCard__icon" aria-hidden>
                      🏪
                    </span>
                    <span className="methodCard__name">Retiro en local</span>
                    <span className="methodCard__desc">15-20 min</span>
                    <span className="methodCard__tag">Gratis</span>
                  </label>
                </div>

                {deliveryMethod === 'delivery' && (
                  <div className="checkoutPanel__group">
                    <label className="checkoutPanel__label" htmlFor="addressInput">
                      Direccion de entrega
                    </label>
                    <input
                      id="addressInput"
                      className="checkoutPanel__input"
                      placeholder="Calle Principal 123, Depto 4"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                    />
                  </div>
                )}

                <div className="checkoutPanel__group">
                  <label className="checkoutPanel__label" htmlFor="deliveryDateInput">
                    Fecha de entrega (opcional)
                  </label>
                  <input
                    id="deliveryDateInput"
                    type="date"
                    className="checkoutPanel__input checkoutPanel__input--small"
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                  />
                  <small className="checkoutPanel__hint">Deja en blanco para recibir lo antes posible</small>
                </div>

                <div className="checkoutPanel__actions checkoutPanel__actions--right">
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ marginRight: 'auto' }}
                    onClick={() => handlePrevStep('cart')}
                  >
                    &larr; Volver al carrito
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleNextStep('payment')}
                  >
                    Continuar al pago &rarr;
                  </button>
                </div>
              </section>
            )}

            {currentStep === 'payment' && (
              <section className="checkoutPanel">
                <h2 className="checkoutPanel__title">Metodo de pago</h2>
                <div className="checkoutPanel__methodsRow">
                  <label className={`methodCard ${paymentMethod === 'card' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span className="methodCard__icon" aria-hidden>
                      💳
                    </span>
                    <span className="methodCard__name">Tarjeta</span>
                  </label>

                  <label className={`methodCard ${paymentMethod === 'cash' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    <span className="methodCard__icon" aria-hidden>
                      💵
                    </span>
                    <span className="methodCard__name">Efectivo</span>
                  </label>

                  <label className={`methodCard ${paymentMethod === 'transfer' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                    />
                    <span className="methodCard__icon" aria-hidden>
                      🏦
                    </span>
                    <span className="methodCard__name">Transferencia</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="checkoutPanel__cardForm">
                    <div className="checkoutPanel__group">
                      <label className="checkoutPanel__label" htmlFor="cardNumber">
                        Numero de tarjeta
                      </label>
                      <input
                        id="cardNumber"
                        className="checkoutPanel__input"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(event) => setCardNumber(event.target.value)}
                      />
                    </div>

                    <div className="checkoutPanel__group">
                      <label className="checkoutPanel__label" htmlFor="cardName">
                        Nombre en la tarjeta
                      </label>
                      <input
                        id="cardName"
                        className="checkoutPanel__input"
                        placeholder="NOMBRE APELLIDO"
                        value={cardName}
                        onChange={(event) => setCardName(event.target.value.toUpperCase())}
                      />
                    </div>

                    <div className="checkoutPanel__row">
                      <div className="checkoutPanel__group">
                        <label className="checkoutPanel__label" htmlFor="cardExp">
                          Expiracion
                        </label>
                        <input
                          id="cardExp"
                          type="month"
                          className="checkoutPanel__input"
                          value={cardExp}
                          onChange={(event) => setCardExp(event.target.value)}
                        />
                      </div>

                      <div className="checkoutPanel__group">
                        <label className="checkoutPanel__label" htmlFor="cardCvv">
                          CVV
                        </label>
                        <input
                          id="cardCvv"
                          type="password"
                          className="checkoutPanel__input"
                          placeholder="***"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(event) => setCardCvv(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="checkoutPanel__actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handlePrevStep('delivery')}
                  >
                    &larr; Volver
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleNextStep('confirm')}
                  >
                    Revisar pedido &rarr;
                  </button>
                </div>
              </section>
            )}

            {currentStep === 'confirm' && (
              <section className="checkoutPanel">
                <h2 className="checkoutPanel__title">Confirmar pedido</h2>

                <div className="checkoutPanel__confirmList">
                  {items.map((item) => (
                    <article key={item.id} className="confirmItem">
                      <span className="confirmItem__emoji" aria-hidden>
                        {item.emoji}
                      </span>
                      <div className="confirmItem__info">
                        <h4 className="confirmItem__title">{item.name}</h4>
                        <p className="confirmItem__subtext">{item.quantity}x Regular</p>
                      </div>
                      <strong className="confirmItem__price">{formatCOP(item.price * item.quantity)}</strong>
                    </article>
                  ))}
                </div>

                <div className="checkoutPanel__summaryDetails">
                  <div className="summaryDetailRow">
                    <span className="summaryDetailRow__label">Entrega</span>
                    <span className="summaryDetailRow__value">
                      {deliveryMethod === 'delivery' ? '🚴 Delivery' : '🏪 Retiro en local'}
                    </span>
                  </div>
                  <div className="summaryDetailRow">
                    <span className="summaryDetailRow__label">Pago</span>
                    <span className="summaryDetailRow__value">
                      {paymentMethod === 'card'
                        ? '💳 Tarjeta'
                        : paymentMethod === 'cash'
                          ? '💵 Efectivo'
                          : '🏦 Transferencia'}
                    </span>
                  </div>
                  <div className="summaryDetailRow">
                    <span className="summaryDetailRow__label">Subtotal</span>
                    <span className="summaryDetailRow__value">{formatCOP(subtotal)}</span>
                  </div>
                  <div className="summaryDetailRow">
                    <span className="summaryDetailRow__label">Envio</span>
                    <span className="summaryDetailRow__value">
                      {shipping === 0 ? 'Gratis' : formatCOP(shipping)}
                    </span>
                  </div>
                  <div className="summaryDetailRow summaryDetailRow--total">
                    <span className="summaryDetailRow__label">Total</span>
                    <span className="summaryDetailRow__value">{formatCOP(total)}</span>
                  </div>
                </div>

                <div className="checkoutPanel__actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handlePrevStep('payment')}
                  >
                    &larr; Volver
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onConfirmOrder(deliveryMethod, total)}
                  >
                    Confirmar pedido • {formatCOP(total)}
                  </button>
                </div>
              </section>
            )}
          </main>

          <aside className="clientCheckoutView__sidebar">
            <div className="sidebarSummary">
              <h3 className="sidebarSummary__title">
                Tu pedido ({items.reduce((acc, item) => acc + item.quantity, 0)})
              </h3>
              <ul className="sidebarSummary__list">
                {items.map((item) => (
                  <li key={item.id} className="sidebarSummary__listItem">
                    <span className="sidebarSummary__qty">{item.quantity}x</span>
                    <span className="sidebarSummary__name">{item.name}</span>
                    <span className="sidebarSummary__price">{formatCOP(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="sidebarSummary__totalRow">
                <span>Total</span>
                <strong>{formatCOP(total)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}