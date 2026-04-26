export interface UserDocument {
  id?: string;
  email: string;
  role: 'admin' | 'client';
  name: string;
  phone?: string;
  createdAt: string;
}

export interface ProductDocument {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  ingredients: string[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  emoji?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDocument {
  id?: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionDocument {
  id?: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed-amount' | 'free-shipping';
  discountValue: number;
  currentUses: number;
  maxUses: number;
  validUntil: string;
  isActive: boolean;
  conditions: {
    minOrderTotal: number;
    takeoutOnly: boolean;
    minItems: number;
    firstOrderOnly: boolean;
  };
}
