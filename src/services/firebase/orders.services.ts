import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';
import type { OrderDocument } from './types';

// Referencia a la colección de órdenes
const ordersRef = collection(db, COLLECTIONS.ORDERS);

/**
 * Escucha las órdenes en tiempo real para el panel de administración.
 * @param callback Función que se ejecuta cada vez que hay un cambio en las órdenes.
 * @returns Función para cancelar la suscripción (unsubscribe)
 */
export const listenToAllOrders = (callback: (orders: OrderDocument[]) => void) => {
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const orders: OrderDocument[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as OrderDocument);
    });
    callback(orders);
  }, (error) => {
    console.error("Error al escuchar órdenes:", error);
  });
};

/**
 * Escucha las órdenes en tiempo real de un usuario específico.
 */
export const listenToUserOrders = (userId: string, callback: (orders: OrderDocument[]) => void) => {
  const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const orders: OrderDocument[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as OrderDocument);
    });
    callback(orders);
  });
};

/**
 * Crea una nueva orden en la base de datos
 */
export const createOrder = async (orderData: Omit<OrderDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creando orden:", error);
    throw error;
  }
};

/**
 * Actualiza el estado de una orden (ideal para el admin)
 */
export const updateOrderStatus = async (orderId: string, status: OrderDocument['status']) => {
  try {
    const orderDoc = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderDoc, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error actualizando el estado de la orden ${orderId}:`, error);
    throw error;
  }
};
