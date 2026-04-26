import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore';
import { db, auth } from './config';
import { COLLECTIONS } from './collections';
import type { PromotionDocument } from './types';

const promotionsRef = collection(db, COLLECTIONS.PROMOTIONS);

export const listenToAllPromotions = (callback: (promotions: PromotionDocument[]) => void, specifiedOwnerId?: string) => {
  const currentOwnerId = specifiedOwnerId || auth.currentUser?.uid;
  if (!currentOwnerId) {
     console.warn("Intento de recuperar promos sin ownerId. Retorno vacío.");
     callback([]);
     return () => {};
  }
  
  const q = query(promotionsRef, where("ownerId", "==", currentOwnerId));
  return onSnapshot(q, (snapshot) => {
    const promos: PromotionDocument[] = [];
    snapshot.forEach((doc) => {
      promos.push({ id: doc.id, ...doc.data() } as PromotionDocument);
    });
    callback(promos);
  }, (error) => {
    console.error("Error al escuchar promociones:", error);
  });
};

export const createPromotion = async (promoData: Omit<PromotionDocument, 'id'>, specifiedOwnerId?: string) => {
  const currentOwnerId = specifiedOwnerId || auth.currentUser?.uid;
  if (!currentOwnerId) throw new Error("No hay ownerId válido para esta promo.");

  try {
    const docRef = await addDoc(promotionsRef, {
      ...promoData,
      ownerId: currentOwnerId
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creando nueva promoción:", error);
    throw error;
  }
};

export const updatePromotion = async (promoId: string, data: Partial<PromotionDocument>) => {
  try {
    const docRef = doc(db, COLLECTIONS.PROMOTIONS, promoId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error actualizando promoción ${promoId}:`, error);
    throw error;
  }
};

export const deletePromotion = async (promoId: string) => {
  try {
    const docRef = doc(db, COLLECTIONS.PROMOTIONS, promoId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error eliminando promoción ${promoId}:`, error);
    throw error;
  }
};
