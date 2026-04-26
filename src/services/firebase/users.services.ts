import { 
  collection, 
  onSnapshot, 
  query, 
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './config';
import type { UserDocument } from './types';

// Escuchar todos los usuarios en tiempo real (para el dashboard admin)
export function listenToAllUsers(callback: (users: UserDocument[]) => void) {
  const usersRef = collection(db, 'users');
  // Se podría ordenar por fecha de creación, pero primero vemos si existe el campo
  const q = query(usersRef);

  return onSnapshot(q, (snapshot) => {
    const users: UserDocument[] = [];
    snapshot.forEach((docNode) => {
      users.push({ id: docNode.id, ...docNode.data() } as UserDocument);
    });
    callback(users);
  });
}

// Obtener un usuario específico
export async function getUserById(userId: string): Promise<UserDocument | null> {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as UserDocument;
  }
  return null;
}
