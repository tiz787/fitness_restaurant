import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';
import type { ProductDocument } from './types';

// Referencia principal a la colección de productos en la base de datos Firestore
const productsRef = collection(db, COLLECTIONS.PRODUCTS);

/**
 * Escucha todos los productos en tiempo real, ideal para mostrar el menú al cliente.
 * Se actualiza solo en el frontend si el administrador cambia el precio, oculta el platillo, etc.
 * @param callback Función que se llamará con el arreglo de productos cada vez que haya un cambio
 * @returns Función () => void para cancelar la suscripción cuando el componente se desmonte
 */
export const listenToAllProducts = (callback: (products: ProductDocument[]) => void) => {
  // Ordenar productos alfabéticamente por default
  const q = query(productsRef, orderBy('name', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const products: ProductDocument[] = [];
    snapshot.forEach((doc) => {
      // Guardamos la estructura del producto junto con el ID único generado por Firebase
      products.push({ id: doc.id, ...doc.data() } as ProductDocument);
    });
    // Entregamos los datos al componente React (menú)
    callback(products);
  }, (error) => {
    console.error("Error al escuchar productos del menú:", error);
  });
};

/**
 * Funcionalidad para el ADMIN:
 * Añade un nuevo platillo al menú y lo sincronizará al instante en todas las pantallas de los clientes.
 * @param productData La información del nuevo platillo
 */
export const createProduct = async (productData: Omit<ProductDocument, 'id'>) => {
  try {
    const docRef = await addDoc(productsRef, productData);
    return docRef.id;
  } catch (error) {
    console.error("Error creando nuevo platillo:", error);
    throw error;
  }
};

/**
 * Funcionalidad para el ADMIN:
 * Actualiza la información de un producto (precio, imagen, disponibilidad).
 */
export const updateProduct = async (productId: string, data: Partial<ProductDocument>) => {
  try {
    const productDocRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await updateDoc(productDocRef, data);
  } catch (error) {
    console.error(`Error actualizando platillo ${productId}:`, error);
    throw error;
  }
};

/**
 * Funcionalidad para el ADMIN:
 * Elimina un producto definitivamente del menú.
 */
export const deleteProduct = async (productId: string) => {
  try {
    const productDocRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await deleteDoc(productDocRef);
  } catch (error) {
    console.error(`Error eliminando platillo ${productId}:`, error);
    throw error;
  }
};
