export interface OrderSuccessInfo {
  id: string
  deliveryMethod: 'delivery' | 'pickup'
  estimatedMinutes: number
  totalPaid: number
}

export interface ClientOrderSuccessViewProps {
  orderInfo: OrderSuccessInfo | null
  onBackToHome: () => void
  onTrackOrder: () => void
}