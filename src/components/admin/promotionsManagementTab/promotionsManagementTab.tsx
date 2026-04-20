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

// Convierte fechas legacy dd/mm/yyyy a yyyy-mm-dd para input type=date.
const toInputDate = (rawDate: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return rawDate
  }

  const slashDate = rawDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (slashDate) {
    const [, day, month, year] = slashDate
    return `${year}-${month}-${day}`
  }

  return ''
}

// Convierte yyyy-mm-dd a dd/mm/yyyy para visualizacion.
const toDisplayDate = (rawDate: string): string => {
  const isoDate = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoDate) {
    const [, year, month, day] = isoDate
    return `${day}/${month}/${year}`
  }

  return rawDate
}

// Formatea montos en moneda colombiana.
const formatCOP = (amount: number): string => `COP ${amount.toLocaleString('es-CO')}`

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
  return formatCOP(coupon.discountValue)
}

// Convierte estado de cupon a clase CSS utilizable.
const toCouponStatusToken = (status: PromotionCoupon['status']): string =>
  status.toLowerCase().replace(/\s+/g, '-')

// Renderiza la pestaña de promociones y cupones del admin.
export default function PromotionsManagementTab({ initialCoupons }: PromotionsManagementTabProps) {
  // Guarda lista local de cupones para interacciones de UI.
  const [coupons, setCoupons] = useState<PromotionCoupon[]>(initialCoupons)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<PromotionCoupon | null>(null);
  // Controla valores del formulario de creacion.
  const [formValues, setFormValues] = useState<NewCouponFormValues>(initialNewCouponFormValues)
  // Controla el mensaje de exito
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Obtiene cupones activos (no eliminados por soft-delete).
  const activeDirectoryCoupons = useMemo(() => coupons.filter(c => !c.isDeleted), [coupons])

  // Calcula metricas superiores de la pestaña promociones descartando eliminados.
  const couponStats = useMemo(() => {
    // Cuenta cupones activos actuales.
    const activeCoupons = activeDirectoryCoupons.filter((coupon) => coupon.status === 'Activo').length
    // Cuenta cupones inactivos actuales.
    const inactiveCoupons = activeDirectoryCoupons.filter((coupon) => coupon.status === 'Inactivo').length
    // Cuenta cupones vencidos/expirados.
    const expiredCoupons = activeDirectoryCoupons.filter((coupon) => coupon.status === 'Expirado').length
    // Suma total de usos de todos los cupones no borrados.
    const totalUses = activeDirectoryCoupons.reduce((accumulator, coupon) => accumulator + coupon.currentUses, 0)

    // Retorna objeto final para pintar metricas.
    return {
      activeCoupons,
      inactiveCoupons,
      expiredCoupons,
      totalUses,
    }
  }, [activeDirectoryCoupons])

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

  // Procesa creacion o edicion de un cupon.
  const handleSaveCoupon = (event: FormEvent<HTMLFormElement>): void => {
    // Evita recarga completa de pagina al enviar formulario.
    event.preventDefault()

    // Evita guardar si faltan campos clave del cupon.
    if (formValues.code.trim().length === 0 || formValues.title.trim().length === 0) {
      return
    }

    if (modalMode === 'edit' && editingCouponId) {
      setCoupons((prev) => 
        prev.map((c) => c.id === editingCouponId ? {
          ...c,
          code: formValues.code.trim().toUpperCase(),
          title: formValues.title.trim(),
          description: formValues.description.trim(),
          discountType: formValues.discountType,
          discountValue: formValues.discountType === 'free-shipping' ? 0 : toNumber(formValues.discountValue),
          maxUses: Math.max(1, toNumber(formValues.maxUses)),
          expiresOn: formValues.expiresOn,
          conditions: {
            ...c.conditions,
            minOrderTotal: Math.max(0, toNumber(formValues.minOrderTotal)),
            takeoutOnly: formValues.takeoutOnly,
            minItems: Math.max(1, toNumber(formValues.minItems)),
            firstOrderOnly: formValues.firstOrderOnly,
          }
        } : c)
      )
      setSuccessMessage('Cupon actualizado correctamente.')
    } else {
      // Construye nuevo cupon basado en formulario actual.
      const nextCoupon: PromotionCoupon = {
        id: `coupon-${Date.now()}`,
        code: formValues.code.trim().toUpperCase(),
        title: formValues.title.trim(),
        description:
          formValues.description.trim().length > 0
            ? formValues.description.trim()
            : 'Cupon creado desde panel admin.',
        discountType: formValues.discountType,
        discountValue:
          formValues.discountType === 'free-shipping' ? 0 : toNumber(formValues.discountValue),
        currentUses: 0,
        maxUses: Math.max(1, toNumber(formValues.maxUses)),
        expiresOn: formValues.expiresOn,
        status: 'Activo',
        conditions: {
          minOrderTotal: Math.max(0, toNumber(formValues.minOrderTotal)),
          takeoutOnly: formValues.takeoutOnly,
          minItems: Math.max(1, toNumber(formValues.minItems)),
          firstOrderOnly: formValues.firstOrderOnly,
        },
      }
      setCoupons((previousCoupons) => [nextCoupon, ...previousCoupons])
      setSuccessMessage('Cupon creado correctamente.')
    }

    setTimeout(() => {
      setSuccessMessage(null)
      setIsModalOpen(false)
    }, 3000)

    setFormValues(initialNewCouponFormValues)
    setEditingCouponId(null)
  }

  // Prepara modal para crear
  const handleOpenCreateModal = (): void => {
    setModalMode('create')
    setFormValues(initialNewCouponFormValues)
    setEditingCouponId(null)
    setSelectedCoupon(null)
    setSuccessMessage(null)
    setIsModalOpen(true)
  }

  // Prepara modal para editar
  const handleOpenEditModal = (coupon: PromotionCoupon): void => {
    setModalMode('edit')
    setFormValues({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      maxUses: coupon.maxUses.toString(),
      expiresOn: toInputDate(coupon.expiresOn),
      minOrderTotal: coupon.conditions.minOrderTotal.toString(),
      minItems: coupon.conditions.minItems.toString(),
      takeoutOnly: coupon.conditions.takeoutOnly,
      firstOrderOnly: coupon.conditions.firstOrderOnly,
    })
    setEditingCouponId(coupon.id)
    setSelectedCoupon(null)
    setSuccessMessage(null)
    setIsModalOpen(true)
  }

  // Prepara modal para ver detalles
  const handleOpenViewModal = (coupon: PromotionCoupon): void => {
    setModalMode('view')
    setSelectedCoupon(coupon)
    setIsModalOpen(true)
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
    setSuccessMessage(null)
  }

  // Cambia el estado del cupon a Activo o Inactivo
  const handleToggleStatus = (coupon: PromotionCoupon): void => {
    const nextStatus = coupon.status === 'Activo' ? 'Inactivo' : 'Activo'
    setCoupons((prev) => 
      prev.map((c) => c.id === coupon.id ? { ...c, status: nextStatus } : c)
    )
  }

  // Soft delete para eliminar temporalmente de la vista.
  const handleDeleteCoupon = (couponId: string): void => {
    const userConfirmed = window.confirm('¿Seguro que deseas eliminar este cupon? (Soft delete)')
    if (userConfirmed) {
      setCoupons((prev) => 
        prev.map((c) => c.id === couponId ? { ...c, isDeleted: true } : c)
      )
    }
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
          onClick={handleOpenCreateModal}
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

      {isModalOpen ? (
        <div className="promotionsManagementTab__modalOverlay" onClick={handleCloseModal}>
          <div
            className="promotionsManagementTab__modalContent panelCard"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="promotionsManagementTab__modalHeader">
              <h3 className="promotionsManagementTab__formTitle">
                {modalMode === 'create' ? 'Crear nuevo cupon' : modalMode === 'edit' ? `Editar cupon: ${formValues.code}` : `Detalles del cupon: ${selectedCoupon?.code}`}
              </h3>
              <button
                type="button"
                className="promotionsManagementTab__closeModalButton"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>

            {successMessage ? (
              <div className="promotionsManagementTab__successMessage">{successMessage}</div>
            ) : modalMode === 'view' && selectedCoupon ? (
              <div className="promotionsManagementTab__viewDetails">
                <p><strong>ID:</strong> {selectedCoupon.id}</p>
                <p><strong>Codigo:</strong> {selectedCoupon.code}</p>
                <p><strong>Titulo:</strong> {selectedCoupon.title}</p>
                <p><strong>Descripcion:</strong> {selectedCoupon.description}</p>
                <p><strong>Estado:</strong> {selectedCoupon.status}</p>
                <p><strong>Tipo de descuento:</strong> {selectedCoupon.discountType}</p>
                <p><strong>Valor Descuento:</strong> {formatDiscountValue(selectedCoupon)}</p>
                <p><strong>Usos:</strong> {selectedCoupon.currentUses} de {selectedCoupon.maxUses}</p>
                <p><strong>Vence el:</strong> {toDisplayDate(selectedCoupon.expiresOn)}</p>
                <p><strong>Pedido Minimo:</strong> {formatCOP(selectedCoupon.conditions.minOrderTotal)}</p>
                <p><strong>Minimo Productos:</strong> {selectedCoupon.conditions.minItems}</p>
                <p><strong>Solo llevar:</strong> {selectedCoupon.conditions.takeoutOnly ? 'Si' : 'No'}</p>
                <p><strong>Primera Orden:</strong> {selectedCoupon.conditions.firstOrderOnly ? 'Si' : 'No'}</p>
              </div>
            ) : (
              <form className="promotionsManagementTab__form" onSubmit={handleSaveCoupon}>
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

                <div className="promotionsManagementTab__formCheckboxes">
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
                  <button type="submit" className="promotionsManagementTab__saveButton">
                    {modalMode === 'edit' ? 'Guardar cambios' : 'Crear cupon'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {activeDirectoryCoupons.length === 0 ? (
         <div className="promotionsManagementTab__emptyState">
           <div className="promotionsManagementTab__emptyIcon" aria-hidden>🎟️</div>
           <h3>¡No tienes cupones activos!</h3>
           <p>Impulsa tus ventas creando promociones atractivas para tus clientes.</p>
           <button
             type="button"
             className="promotionsManagementTab__newCouponButton"
             onClick={handleOpenCreateModal}
           >
             ➕ Crear mi primer cupon
           </button>
         </div>
      ) : (
        <div className="promotionsManagementTab__cards" aria-label="Listado de cupones">
          {activeDirectoryCoupons.map((coupon) => {
            // Calcula porcentaje de uso para barra de progreso.
            const usagePercentage = Math.min((coupon.currentUses / Math.max(coupon.maxUses, 1)) * 100, 100)

            return (
              <article key={coupon.id} className={`promotionCouponCard ${coupon.status === 'Inactivo' ? 'is-inactive' : ''}`}>
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
                  <span>Usos: {coupon.currentUses}/{coupon.maxUses}</span>
                  <span>Vence: {coupon.expiresOn ? toDisplayDate(coupon.expiresOn) : 'Sin fecha'}</span>
                </div>
                <div className="promotionCouponCard__usageTrack" aria-hidden>
                  <span style={{ width: `${usagePercentage}%` }} />
                </div>

                <div className="promotionCouponCard__actionButtons">
                  <button type="button" onClick={() => handleOpenViewModal(coupon)}>
                    👁️ Ver 
                  </button>
                  <button type="button" onClick={() => handleOpenEditModal(coupon)}>
                    ✏️ Editar
                  </button>
                  <button type="button" onClick={() => handleToggleStatus(coupon)}>
                    {coupon.status === 'Activo' ? '⏸️ Desactivar' : '▶️ Activar'}
                  </button>
                  <button type="button" className="btn-danger" onClick={() => handleDeleteCoupon(coupon.id)}>
                    🗑️ Eliminar
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
