#  Arquitectura del Proyecto: Fitness Restaurant Dashboard

## 1. Patr�n Arquitect�nico
Adoptaremos un enfoque de **Arquitectura por Funcionalidades (Feature-based Architecture)** combinado con principios de **Dise�o Orientado al Dominio (DDD)**. Esto permite que el proyecto sea modular, f�cil de testear y escalable a medida que se agregan nuevas reglas de negocio.

---

## 2. Estructura de Carpetas 

```text
/src
  /assets          # Im�genes, logos, fuentes globales.
  /components      # Componentes UI at�micos (Buttons, Inputs, Cards).
    /ui            # Componentes gen�ricos.
    /forms         # Layouts de formularios.
  /features        # M�dulos principales del negocio.
    /catalog       # CRUD de platillos: componentes, hooks, servicios.
    /orders        # Toma de pedidos y gesti�n de estados.
    /stats         # Dashboards y l�gica de anal�tica.
  /hooks           # Hooks compartidos (useAuth, useLocalStorage).
  /models          # Interfaces y tipos de TypeScript.
  /services        # Capa de abstracci�n de datos (Firebase config, API wrappers).
  /context         # Proveedores de estado global (Context API).
  /styles          # Variables CSS, resets y utilidades globales.
  /utils           # Funciones puras (formateo de moneda, fechas).
  /pages           # Componentes de ruta (Home, Dashboard, Login).
```

---

## 3. Modelos de Datos (Interfaces TypeScript) 

### 3.1. Platillo (`IDish`)
Define la estructura de un �tem en el men�.
```typescript
interface IDish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Ensaladas' | 'Prote�nas' | 'Bebidas' | 'Postres';
  imageUrl?: string;
  isAvailable: boolean;
  calories?: number;
  allergens: string[];
  createdAt: number;
}
```

### 3.2. Orden (`IOrder`)
Representa una transacci�n de venta.
```typescript
interface IOrderItem {
  dishId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface IOrder {
  id: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  staffId: string; // ID del mesero
  timestamp: number;
  paymentMethod?: 'cash' | 'card';
}
```

---

## 4. Gesti�n del Estado 

Utilizaremos una combinaci�n de dos estrategias:
1.  **Estado Local (useState/useReducer)**: Para el manejo de inputs en formularios y estados de UI ef�meros (ej. si un modal est� abierto).
2.  **Estado Global (Zustand o Context API)**:
    *   `AuthContext`: Mantiene la sesi�n del usuario de Firebase.
    *   `CartContext`: Gestiona la orden activa antes de ser enviada a la base de datos.
    *   `GlobalConfig`: Preferencias como el modo oscuro o idioma.

---

## 5. Capa de Servicios (Services)
Para evitar el acoplamiento directo con Firebase en los componentes, crearemos descriptores:
*   `dishService.ts`: M�TODOS `getAllAvailable()`, `updateDish()`, `deleteDish()`.
*   `orderService.ts`: M�TODOS `createOrder()`, `getDailyStats()`, `markAsDone()`.

---

## 6. Flujo de Datos 
1.  **Entrada**: El usuario interact�a con un componente de Feature (ej. `AddDishForm`).
2.  **Validaci�n**: Se valida el esquema con Zod.
3.  **Acci�n**: Se llama a una funci�n del `service`.
4.  **Persistencia**: El `service` actualiza Firestore.
5.  **Reacci�n**: Firestore emite un evento en tiempo real, React detecta el cambio y actualiza la UI autom�ticamente.

---

## 7. Preguntas Estrat�gicas para el Cliente (Arquitectura)

1.  **Volumen de datos esperado?**: Cu�ntos pedidos calculan procesar por hora en momentos pico? (Para optimizar lecturas).
2.  **Manejo de concurrencia?**: Dos meseros pueden editar el mismo platillo al mismo tiempo? Qui�n tiene prioridad?
3.  **Borrados l�gicos o f�sicos?**: Si eliminan un plato, debe desaparecer de la DB o solo marcarse como "oculto" (Soft Delete)?
4.  **Validaci�n por IA?**: Desean integrar en el futuro validaci�n autom�tica de fotos de platos mediante visi�n artificial?
5.  **Control de Sesiones?**: Un mesero puede estar logueado en varios dispositivos simult�neamente?
6.  **Logs de Actividad?**: Es necesario guardar qui�n cambi� el precio de un plato y cu�ndo?
7.  **Integraci�n de APIs Externas?**: Debemos conectar el cat�logo con su sitio web principal de forma autom�tica?
8.  **Respaldo de Datos?**: Con qu� frecuencia requieren copias de seguridad descargables de sus ventas?
9.  **Jerarqu�a de Roles?**: Habr� un rol intermedio entre Mesero y Admin (ej. Jefe de Cocina)?
10. **Tiempo de Expiraci�n?**: Las �rdenes "Pendientes" deben auto-cancelarse tras X horas si no se marcan como "Hechas"?

---

## 8. Estrategia de Testing 
- **L�gica de Dominio**: Pruebas unitarias para el c�lculo de IVA y descuentos.
- **Integraci�n**: Pruebas de comunicaci�n con el emulador de Firebase.
- **Componentes**: Pruebas de renderizado con React Testing Library para asegurar que los mensajes de error se muestran correctamente.

---

## 9. Seguridad y Reglas de Negocio
Las reglas de validaci�n (ej. "el precio no puede ser negativo") se aplicar�n en tres niveles:
1.  **UI**: HTML5 `min` attributes.
2.  **Frontend**: Validaciones de TypeScript y Zod.
3.  **Backend**: Firebase Security Rules para evitar escrituras maliciosas directas a la base de datos.

---

## 10. Evoluci�n Arquitect�nica
Se prev� que si el negocio crece a m�s de 10 sucursales, se migrar� la l�gica de servicios a un **BFF (Backend For Frontend)** en Node.js para centralizar la computaci�n pesada y reducir la latencia en dispositivos m�viles de gama baja.
