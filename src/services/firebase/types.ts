export interface UserDocument {
  id?: string;
  email: string;
  role: 'admin' | 'client';
  name: string;
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
  discountPercentage: number;
  isActive: boolean;
  validUntil: string;
}
