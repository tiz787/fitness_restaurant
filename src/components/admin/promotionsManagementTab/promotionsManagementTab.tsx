// Importa estado y utilidades para manejo local de cupones.
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
// Importa tipos para cupones y sus variantes de descuento.
import type {
  CouponDiscountType,
  PromotionCoupon,
} from '../adminDashboard/adminDashboard.types'
// Importa estilos de la pestaña de promociones.
import './promotionsManagementTab.css'

// Define propiedades del modulo de promociones.
interface PromotionsManagementTabProps {
  // Cupones estaticos iniciales que se muestran en pantalla.
  initialCoupons: PromotionCoupon[]
}

// Define el modelo del formulario de creacion de cupon.
interface NewCouponFormValues {
  // Codigo unico del cupon.
  code: string
  // Titulo corto de la promocion.
  title: string
  // Descripcion breve del beneficio.
  description: string
  // Tipo de descuento aplicado.
  discountType: CouponDiscountType
  // Valor del descuento en texto para parseo.
  discountValue: string
  // Limite maximo de usos del cupon.
  maxUses: string
  // Fecha de vencimiento del cupon.
  expiresOn: string
  // Monto minimo del pedido para ser elegible.
  minOrderTotal: string
  // Cantidad minima de productos para aplicar.
  minItems: string
  // Restriccion de solo para llevar/retiro.
  takeoutOnly: boolean
  // Restriccion de solo primer pedido.
  firstOrderOnly: boolean
}

// Define estado inicial del formulario de nuevo cupon.
const initialNewCouponFormValues: NewCouponFormValues = {
  code: '',
  title: '',
  description: '',
  discountType: 'percentage',
  discountValue: '10',
  maxUses: '100',
  expiresOn: '',
  minOrderTotal: '100',
  minItems: '1',
  takeoutOnly: false,
  firstOrderOnly: false,
}

// Convierte string numerico a numero seguro.
const toNumber = (value: string): number => {
  // Intenta parsear string a numero.
  const numericValue = Number(value)
  // Retorna cero si el valor no es valido.
  return Number.isNaN(numericValue) ? 0 : numericValue
}

// Formatea fecha de input HTML a formato legible local.
const formatDateLabel = (rawDate: string): string => {
  // Si ya viene en formato con slash, se retorna igual.
  if (rawDate.includes('/')) {
    return rawDate
  }

  // Si no contiene guion, no se intenta transformar.
  if (!rawDate.includes('-')) {
    return rawDate
  }

  // Divide fecha ISO para reconstruir en formato dd/mm/yyyy.
  const [year, month, day] = rawDate.split('-')
  // Retorna fecha convertida para UI administrativa.
  return `${day}/${month}/${year}`
}

// Formatea el valor visual del descuento segun su tipo.
const formatDiscountValue = (coupon: PromotionCoupon): string => {
  // Muestra texto directo para cupon de envio gratis.
  if (coupon.discountType === 'free-shipping') {
    return 'Envio gratis'
  }

  // Muestra porcentaje cuando el descuento es porcentual.
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}%`
  }

  // Muestra monto en moneda para descuento fijo.
  return `$${coupon.discountValue}`
}

// Convierte estado de cupon a clase CSS utilizable.
const toCouponStatusToken = (status: PromotionCoupon['status']): string =>
  status.toLowerCase().replace(/\s+/g, '-')

// Renderiza la pestaña de promociones y cupones del admin.
export default function PromotionsManagementTab({ initialCoupons }: PromotionsManagementTabProps) {
  // Guarda lista local de cupones para interacciones de UI.
  const [coupons, setCoupons] = useState<PromotionCoupon[]>(initialCoupons)
  // Controla visibilidad del formulario de nuevo cupon.
  const [isCreateFormVisible, setIsCreateFormVisible] = useState<boolean>(false)
  // Controla valores del formulario de creacion.
  const [formValues, setFormValues] = useState<NewCouponFormValues>(initialNewCouponFormValues)

  // Calcula metricas superiores de la pestaña promociones.
  const couponStats = useMemo(() => {
    // Cuenta cupones activos actuales.
    const activeCoupons = coupons.filter((coupon) => coupon.status === 'Activo').length
    // Cuenta cupones inactivos actuales.
    const inactiveCoupons = coupons.filter((coupon) => coupon.status === 'Inactivo').length
    // Cuenta cupones vencidos/expirados.
    const expiredCoupons = coupons.filter((coupon) => coupon.status === 'Expirado').length
    // Suma total de usos de todos los cupones.
    const totalUses = coupons.reduce((accumulator, coupon) => accumulator + coupon.currentUses, 0)

    // Retorna objeto final para pintar metricas.
    return {
      activeCoupons,
      inactiveCoupons,
      expiredCoupons,
      totalUses,
    }
  }, [coupons])

  // Actualiza campos de texto del formulario de cupon.
  const updateTextField =
    (field: keyof NewCouponFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
      // Toma valor actual del control editado.
      const nextValue = event.target.value
      // Guarda valor nuevo preservando el resto del formulario.
      setFormValues((previousValues) => ({
        ...previousValues,
        [field]: nextValue,
      }))
    }

  // Actualiza campos tipo checkbox del formulario.
  const updateToggleField =
    (field: 'takeoutOnly' | 'firstOrderOnly') =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      // Toma valor booleano del checkbox.
      const isChecked = event.target.checked
      // Guarda toggle actualizado en estado local.
      setFormValues((previousValues) => ({
        ...previousValues,
        [field]: isChecked,
      }))
    }

  // Procesa creacion visual de un nuevo cupon.
  const handleCreateCoupon = (event: FormEvent<HTMLFormElement>): void => {
    // Evita recarga completa de pagina al enviar formulario.
    event.preventDefault()

    // Evita crear si faltan campos clave del cupon.
    if (formValues.code.trim().length === 0 || formValues.title.trim().length === 0) {
      return
    }

    // Construye nuevo cupon basado en formulario actual.
    const nextCoupon: PromotionCoupon = {
      id: `coupon-${Date.now()}`,
      code: formValues.code.trim().toUpperCase(),
      title: formValues.title.trim(),
      description:
        formValues.description.trim().length > 0
          ? formValues.description.trim()
          : 'Cupon creado desde panel admin (modo visual).',
      discountType: formValues.discountType,
      discountValue:
        formValues.discountType === 'free-shipping' ? 0 : toNumber(formValues.discountValue),
      currentUses: 0,
      maxUses: Math.max(1, toNumber(formValues.maxUses)),
      expiresOn: formatDateLabel(formValues.expiresOn),
      status: 'Activo',
      conditions: {
        minOrderTotal: Math.max(0, toNumber(formValues.minOrderTotal)),
        takeoutOnly: formValues.takeoutOnly,
        minItems: Math.max(1, toNumber(formValues.minItems)),
        firstOrderOnly: formValues.firstOrderOnly,
      },
    }

    // Inserta cupon al inicio para feedback inmediato.
    setCoupons((previousCoupons) => [nextCoupon, ...previousCoupons])
    // Reinicia valores del formulario tras crear.
    setFormValues(initialNewCouponFormValues)
    // Oculta el formulario para volver al listado.
    setIsCreateFormVisible(false)
  }

  // Renderiza metricas, formulario y lista de cupones.
  return (
    <section className="promotionsManagementTab" aria-label="Promociones y cupones">
      <header className="promotionsManagementTab__header">
        <div>
          <h2 className="promotionsManagementTab__title">Promociones y cupones</h2>
          <p className="promotionsManagementTab__subtitle">
            {couponStats.activeCoupons} cupones activos
          </p>
        </div>

        <button
          type="button"
          className="promotionsManagementTab__newCouponButton"
          onClick={() => setIsCreateFormVisible((previous) => !previous)}
        >
          ➕ Nuevo cupon
        </button>
      </header>

      <section className="promotionsManagementTab__stats" aria-label="Resumen de cupones">
        <article className="promotionStatCard promotionStatCard--success">
          <p>{couponStats.activeCoupons}</p>
          <span>Cupones activos</span>
        </article>

        <article className="promotionStatCard promotionStatCard--warning">
          <p>{couponStats.inactiveCoupons}</p>
          <span>Cupones inactivos</span>
        </article>

        <article className="promotionStatCard promotionStatCard--info">
          <p>{couponStats.totalUses}</p>
          <span>Usos totales</span>
        </article>

        <article className="promotionStatCard promotionStatCard--danger">
          <p>{couponStats.expiredCoupons}</p>
          <span>Expirados</span>
        </article>
      </section>

      {isCreateFormVisible ? (
        <form className="promotionsManagementTab__form panelCard" onSubmit={handleCreateCoupon}>
          <h3 className="promotionsManagementTab__formTitle">Crear cupon</h3>

          <div className="promotionsManagementTab__formGrid">
            <label>
              Codigo
              <input value={formValues.code} onChange={updateTextField('code')} required />
            </label>

            <label>
              Titulo
              <input value={formValues.title} onChange={updateTextField('title')} required />
            </label>

            <label>
              Tipo de descuento
              <select value={formValues.discountType} onChange={updateTextField('discountType')}>
                <option value="percentage">Porcentaje</option>
                <option value="fixed-amount">Monto fijo</option>
                <option value="free-shipping">Envio gratis</option>
              </select>
            </label>

            <label>
              Valor descuento
              <input
                type="number"
                min="0"
                value={formValues.discountValue}
                onChange={updateTextField('discountValue')}
                disabled={formValues.discountType === 'free-shipping'}
              />
            </label>

            <label>
              Max usos
              <input
                type="number"
                min="1"
                value={formValues.maxUses}
                onChange={updateTextField('maxUses')}
              />
            </label>

            <label>
              Vence el
              <input type="date" value={formValues.expiresOn} onChange={updateTextField('expiresOn')} />
            </label>

            <label>
              Pedido minimo
              <input
                type="number"
                min="0"
                value={formValues.minOrderTotal}
                onChange={updateTextField('minOrderTotal')}
              />
            </label>

            <label>
              Min productos
              <input
                type="number"
                min="1"
                value={formValues.minItems}
                onChange={updateTextField('minItems')}
              />
            </label>
          </div>

          <label className="promotionsManagementTab__descriptionField">
            Descripcion
            <textarea
              rows={2}
              value={formValues.description}
              onChange={updateTextField('description')}
              placeholder="Texto corto para describir el objetivo del cupon"
            />
          </label>

          <div className="promotionsManagementTab__toggles">
            <label>
              <input
                type="checkbox"
                checked={formValues.takeoutOnly}
                onChange={updateToggleField('takeoutOnly')}
              />
              Solo para llevar/retiro
            </label>

            <label>
              <input
                type="checkbox"
                checked={formValues.firstOrderOnly}
                onChange={updateToggleField('firstOrderOnly')}
              />
              Solo primer pedido
            </label>
          </div>

          <div className="promotionsManagementTab__formActions">
            <button type="submit">Guardar cupon</button>
          </div>
        </form>
      ) : null}

      <div className="promotionsManagementTab__cards" aria-label="Listado de cupones">
        {coupons.map((coupon) => {
          // Calcula porcentaje de uso para barra de progreso.
          const usagePercentage = Math.min((coupon.currentUses / Math.max(coupon.maxUses, 1)) * 100, 100)

          // Renderiza card de cupon con condiciones de elegibilidad.
          return (
            <article key={coupon.id} className="promotionCouponCard">
              <header className="promotionCouponCard__header">
                <div>
                  <p className="promotionCouponCard__code">🎟️ {coupon.code}</p>
                  <p className="promotionCouponCard__title">{coupon.title}</p>
                </div>

                <div className="promotionCouponCard__rightHeader">
                  <span className={`promotionCouponCard__status promotionCouponCard__status--${toCouponStatusToken(coupon.status)}`}>
                    {coupon.status}
                  </span>
                  <strong>{formatDiscountValue(coupon)}</strong>
                </div>
              </header>

              <p className="promotionCouponCard__description">{coupon.description}</p>

              <div className="promotionCouponCard__usageInfo">
                <span>
                  Usos: {coupon.currentUses}/{coupon.maxUses}
                </span>
                <span>Vence: {coupon.expiresOn || 'Sin fecha'}</span>
              </div>

              <div className="promotionCouponCard__usageTrack" aria-hidden>
                <span style={{ width: `${usagePercentage}%` }} />
              </div>

              <ul className="promotionCouponCard__conditions" aria-label="Condiciones del cupon">
                <li>Pedido minimo: ${coupon.conditions.minOrderTotal}</li>
                <li>Solo llevar: {coupon.conditions.takeoutOnly ? 'Si' : 'No'}</li>
                <li>Min productos: {coupon.conditions.minItems}</li>
                <li>Primer pedido: {coupon.conditions.firstOrderOnly ? 'Si' : 'No'}</li>
              </ul>

              <footer className="promotionCouponCard__footer">
                <p>
                  En checkout (fase siguiente) se validara elegibilidad segun monto, tipo de entrega,
                  cantidad de productos y primer pedido.
                </p>
              </footer>
            </article>
          )
        })}
      </div>
    </section>
  )
}
