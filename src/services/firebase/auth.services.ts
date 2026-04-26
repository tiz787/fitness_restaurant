import { 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  updateProfile,
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { seedDatabaseForNewUser } from './seed.services';

// Auxiliar para guardar o actualizar el usuario en Firestore
const saveUserToFirestore = async (user: User, extraData: { displayName?: string, phone?: string } = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Es un usuario nuevo, guardamos sus datos
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || extraData.displayName || '',
      phone: extraData.phone || '',
      role: 'client', // Por defecto todos son clientes
      createdAt: new Date().toISOString(),
      status: 'active'
    });
    
    // Auto-poblar datos para la demo si es totalmente nuevo
    await seedDatabaseForNewUser(user.uid);
  }
};

export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const registerWithEmailPassword = async (email: string, password: string, displayName: string, phone: string) => {
  try {
    // 1. Crear el usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Actualizar el perfil del usuario (DisplayName)
    await updateProfile(user, { displayName });

    // 3. Guardar en Firestore con campos extra
    await saveUserToFirestore(user, { displayName, phone });

    return user;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    // Podemos añadir un scope extra si quisiéramos, pero por defecto trae email y nombre
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Guardar en base de datos si es la primera vez
    await saveUserToFirestore(user, { displayName: user.displayName || '' });

    return user;
  } catch (error) {
    console.error("Error al acceder con Google:", error);
    throw error;
  }
};

export const signOutCurrentSession = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};
