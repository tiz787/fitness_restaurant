export interface ClientCartItem {
  id: string
  name: string
  subtext: string
  quantity: number
  price: number
  emoji: string
}

export interface ClientCheckoutViewProps {
  items: ClientCartItem[]
  onBackToCart: () => void
  onConfirmOrder: (deliveryMethod: 'delivery' | 'pickup', total: number) => void
}