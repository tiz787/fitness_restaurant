import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

const SEED_PRODUCTS = [
  {
    name: 'Maca Power Bowl',
    price: 18500,
    category: 'Almuerzos',
    description: 'Quinoa, garbanzo, aguacate rostizado, espinaca y aderezo de maca.',
    isActive: true,
    imageUrl: '🥗',
    ingredients: ['Quinoa', 'Garbanzo', 'Aguacate', 'Espinaca', 'Maca', 'Ajonjolí'],
    macros: {
      calories: 450,
      protein: 15,
      carbs: 45,
      fats: 20
    }
  },
  {
    name: 'Vegan Protein Burger',
    price: 24000,
    category: 'Snacks',
    description: 'Hamburguesa de lentejas con pan artesanal sin gluten y alioli vegano.',
    isActive: true,
    imageUrl: '🍔',
    ingredients: ['Lentejas', 'Pan sin gluten', 'Alioli', 'Lechuga', 'Tomate', 'Cebolla'],
    macros: {
      calories: 520,
      protein: 22,
      carbs: 55,
      fats: 18
    }
  },
  {
    name: 'Green Detox Smoothie',
    price: 12000,
    category: 'Smoothies',
    description: 'Bebida funcional con espinaca, apio, manzana verde y jengibre.',
    isActive: true,
    imageUrl: '🥤',
    ingredients: ['Espinaca', 'Apio', 'Manzana Verde', 'Jengibre', 'Limón'],
    macros: {
      calories: 120,
      protein: 3,
      carbs: 25,
      fats: 0
    }
  }
];

const SEED_PROMOTIONS = [
  {
    code: 'MARTESVEG',
    title: 'Martes Veganos',
    description: '20% off en todos los platillos veganos. Válido solo en local.',
    isActive: true,
    discountType: 'percentage',
    discountValue: 20,
    currentUses: 0,
    maxUses: 100,
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // Un mes de validez
    conditions: {
      minOrderTotal: 30000,
      takeoutOnly: false,
      minItems: 1,
      firstOrderOnly: false
    }
  },
  {
    code: 'BIENVENIDA',
    title: 'Primer Pedido',
    description: 'Envío gratis en tu primer pedido superior a $50.000.',
    isActive: true,
    discountType: 'free-shipping',
    discountValue: 0,
    currentUses: 0,
    maxUses: 50,
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
    conditions: {
      minOrderTotal: 50000,
      takeoutOnly: false,
      minItems: 1,
      firstOrderOnly: true
    }
  }
];

const SEED_ORDERS = [
  {
    customerName: 'Cliente Demo',
    status: 'preparing',
    userId: 'user-demo-123',
    subtotal: 42500,
    taxes: 0,
    total: 42500,
    items: [
      { productId: 'mock1', name: 'Maca Power Bowl', quantity: 1, unitPrice: 18500, totalPrice: 18500 },
      { productId: 'mock2', name: 'Vegan Protein Burger', quantity: 1, unitPrice: 24000, totalPrice: 24000 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const seedDatabaseForNewUser = async (ownerId: string) => {
  const batch = writeBatch(db);
  
  // Agregar productos semilla
  SEED_PRODUCTS.forEach(product => {
    const ref = doc(collection(db, COLLECTIONS.PRODUCTS));
    batch.set(ref, { ...product, ownerId });
  });

  // Agregar promociones semilla
  SEED_PROMOTIONS.forEach(promo => {
    const ref = doc(collection(db, COLLECTIONS.PROMOTIONS));
    batch.set(ref, { ...promo, ownerId });
  });

  // Agregar órdenes semilla actualizadas con el ownerId real 
  SEED_ORDERS.forEach(order => {
    const ref = doc(collection(db, COLLECTIONS.ORDERS));
    batch.set(ref, { ...order, userId: ownerId, ownerId }); // Ajustamos userId temporal por el ownerId inicial
  });

  try {
    await batch.commit();
    console.log(`Database seeded successfully for user: ${ownerId}`);
  } catch (error) {
    console.error("Error seeding database: ", error);
  }
};
