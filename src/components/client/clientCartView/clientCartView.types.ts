export interface ClientCartItem {
  id: string
  name: string
  subtext: string
  quantity: number
  price: number
  emoji: string
}

export interface ClientCartViewProps {
  items: ClientCartItem[]
  onAddMoreDishes: () => void
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  promoCode: string
  onPromoCodeChange: (code: string) => void
  onApplyPromoCode: () => void
  onProceedToCheckout: () => void
}
