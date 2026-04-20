// Importamos la función principal para inicializar la aplicación de Firebase con nuestras credenciales
import { initializeApp } from 'firebase/app';
// Importamos getFirestore para la base de datos Firestore (ideal para búsquedas complejas y documentos)
import { getFirestore } from 'firebase/firestore';
// Importamos getDatabase para la Realtime Database (la que viene en tu config, usando databaseURL)
import { getDatabase } from 'firebase/database';
// Importamos getAuth para manejar el inicio de sesión de usuarios y administradores
import { getAuth } from 'firebase/auth';
// Importamos getAnalytics para las métricas de uso de los clientes en nuestra app
import { getAnalytics } from "firebase/analytics";

// Objeto de configuración de Firebase. 
// Usamos import.meta.env para asegurar que Vite lea las variables del archivo .env que acabamos de crear y no queden públicas hardcodeadas si subes esto a un repositorio.
const firebaseConfig = {
  // Clave pública para conectar con los servidores de Firebase
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // Dominio usado por Firebase Auth para redirecciones y manejo de sesión
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // URL de tu base de datos en tiempo real (Realtime Database)
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  // Identificador único de tu proyecto en la nube de Google Firebase
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Repositorio donde se guardarán las imágenes de tus platillos (Cloud Storage)
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // ID para el servicio de envío de notificaciones
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // Identificador único de la aplicación web registrada en Firebase
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // ID de medición de Google Analytics para registrar eventos de usuario
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializamos la aplicación de Firebase, inyectando la configuración definida arriba.
// app es la instancia principal que los demás servicios requerirán.
const app = initializeApp(firebaseConfig);

// Inicializamos Google Analytics pasando la app principal. Esto habilitará reportes de tráfico.
export const analytics = getAnalytics(app);

// Inicializamos y exportamos Firestore para guardar documentos (usuarios, menú, promociones)
export const db = getFirestore(app);

// Inicializamos y exportamos Realtime Database, muy útil si decides hacer sistema de chat o tracking más puro
export const realTimeDb = getDatabase(app);

// Inicializamos y exportamos el sistema de Autenticación para crear logins seguros
export const auth = getAuth(app);
