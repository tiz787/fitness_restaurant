# README de Implementación — Fitness Restaurant

Este documento explica, por fases, qué lógica implementar en el proyecto y cómo hacerlo paso a paso. Está pensado para un desarrollador junior y asume que toda la persistencia se hará en `localStorage` del navegador.

**Resumen rápido (prioridad de implementación)**
- Fase 1 (MVP): Catálogo, Carrito y persistencia en `localStorage` (productos, carrito, órdenes).
- Fase 2: Gestión de Pedidos (páginas de administración: ver/editar estados de órdenes).
- Fase 3: Reportes y estadísticas (agregaciones sobre órdenes y ventas).
- Fase 4: Mejoras, validaciones y testing.

---

**Mapeo de archivos relevantes (inicio)**
- Catálogo: [src/pages/catalogo.html](src/pages/catalogo.html)
- Gestión de pedidos: [src/pages/gestion-de-pedidos.html](src/pages/gestion-de-pedidos.html)
- Gestionar órdenes (detalle/edición): [src/pages/gestionar-ordenes.html](src/pages/gestionar-ordenes.html)
- Reportes: [src/pages/reportes.html](src/pages/reportes.html)
- Estilos generales: [src/css/components.css](src/css/components.css), [src/css/utilities.css](src/css/utilities.css)
- Imágenes y assets: [src/assets/images](src/assets/images)
- Documentación de apoyo: todos los archivos en `docs/` — leer `alcance_del_proyecto.md` y `arquitectura_del_proyecto.md`.

---

**Objetivo de diseño**
- Mantener la UI en HTML/CSS estático y añadir la lógica con JavaScript (archivos JS a crear en `src/` — p. ej. `src/js/app.js`, `src/js/cart.js`).
- Persistir los datos clave en `localStorage` usando claves prefijadas (ver sección de modelos).
- Separar responsabilidades: capa de persistencia (helpers de `localStorage`), lógica de negocio (carrito, órdenes, reportes) y manipulación del DOM (eventos y renderizado).

---

**Modelos de datos y claves `localStorage`**
- Claves propuestas (prefijo `fr_` para "Fitness Restaurant"):
  - `fr_products` — array de productos disponibles.
  - `fr_cart` — objeto con items en carrito y metadatos.
  - `fr_orders` — array de órdenes realizadas.
  - `fr_settings` — (opcional) ajustes de la app.

Ejemplo de producto (JSON):
{
  "id": "p-001",
  "name": "Ensalada energética",
  "price": 8.5,
  "image": "assets/images/ensalada.png",
  "category": "ensaladas",
  "stock": 20,
  "description": "Ensalada con quinoa y pollo"
}

Ejemplo de carrito (JSON):
{
  "items": [
    { "productId": "p-001", "quantity": 2, "price": 8.5 }
  ],
  "subtotal": 17.0,
  "createdAt": 1670000000000
}

Ejemplo de orden (JSON):
{
  "orderId": "o-20250223-001",
  "items": [ { "productId": "p-001", "quantity": 2, "price": 8.5 } ],
  "subtotal": 17.0,
  "tax": 0.0,
  "total": 17.0,
  "status": "pendiente", // pendiente | en_preparacion | listo | entregado | cancelado
  "customer": { "name": "Cliente Ejemplo", "phone": "12345678" },
  "createdAt": 1670000000000,
  "updatedAt": 1670000000000
}

---

**Helpers recomendados (pseudo-código / funciones a implementar)**n- `storage.set(key, value)` — stringify y guardar.
- `storage.get(key, fallback)` — parse y devolver fallback si no existe.
- `initProducts()` — cargar `fr_products` desde JSON embebido o desde `docs/` si hay datos ejemplo.
- `getProductById(id)` — buscar producto en `fr_products`.
- `addToCart(productId, qty)` — agregar o actualizar item en `fr_cart`, recalcular subtotal y guardar.
- `updateCartItem(productId, qty)` — cambiar cantidad y guardar.
- `removeCartItem(productId)` — eliminar item y guardar.
- `placeOrder(customerInfo)` — validar carrito, crear objeto `order`, guardarlo en `fr_orders`, limpiar `fr_cart`.
- `listOrders(filter)` — devolver órdenes (para páginas admin y reportes).
- `updateOrderStatus(orderId, status)` — cambiar `status` y `updatedAt`, guardar.
- `generateReport(range)` — agregaciones (ventas totales, número de órdenes, top productos).

Código de ejemplo simple para `localStorage` (para copiar/pegar):

```js
const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key, fallback = null) {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  }
};

// Uso:
const products = storage.get('fr_products', []);
storage.set('fr_cart', { items: [], subtotal: 0 });
```

---

**Fase 1 — MVP (alta prioridad)**
Objetivo: permitir a un cliente ver productos, añadir al carrito y realizar una orden que se guarde en `localStorage`.

Tareas concretas:
- Crear `src/js/storage.js` con los helpers `storage.get`/`storage.set`.
- Crear `src/js/products.js` con funciones: `initProducts`, `renderProducts()`, `getProductById`.
- Crear `src/js/cart.js` con funciones: `loadCart`, `renderCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `calculateTotals`.
- Modificar `src/pages/catalogo.html` para incluir los scripts y los hooks (botones `Agregar al carrito`) — mapear con selectores claros (`data-product-id`).
- Al confirmar la orden: `placeOrder()` crea la orden y la guarda en `fr_orders`.
- Pruebas manuales: abrir la página, añadir items, verificar `localStorage` (devtools → Application → Local Storage).

Notas para junior:
- Cada vez que cambies `fr_cart` o `fr_orders`, llama a `storage.set` para persistir.
- Mantén la UI reactiva: después de cualquier cambio en el carrito, vuelve a renderizar la sección del carrito.

---

**Fase 2 — Gestión de Pedidos (media prioridad)**
Objetivo: en las páginas de administración, listar órdenes, cambiar su estado y ver detalles.

Tareas concretas:
- Implementar `src/js/orders.js` con `listOrders`, `renderOrdersAdmin`, `updateOrderStatus`.
- En `src/pages/gestion-de-pedidos.html` y `src/pages/gestionar-ordenes.html`:
  - Añadir tabla/listado de órdenes.
  - Botones para cambiar estado (ej: `Marcar en preparación`, `Listo para entrega`).
- Añadir validaciones: no permitir pasar a "entregado" si no está en estado previo correcto.

Persistencia: todas las modificaciones actualizan `fr_orders`.

---

**Fase 3 — Reportes (baja/medio prioridad)**nObjetivo: calcular métricas simples para el negocio.

Tareas concretas:
- Implementar `src/js/reports.js` con `generateReport(range)`.
- Métricas mínimas: ventas totales, número de órdenes por estado, top 5 productos por cantidad.
- Mostrar gráficos simples con HTML/CSS o integrando una librería ligera (`Chart.js`) — opcional.

---

**Fase 4 — Mejoras, validaciones y despliegue**
- Validaciones de formulario (cliente), manejo de errores (ej: stock insuficiente).
- Mejoras UX: loaders, mensajes de éxito/error, confirmaciones antes de eliminar.
- Tests manuales: pasos de prueba para cada flujo.
- Limpieza: documentar funciones, comentarios y README final.

---

**Guía de implementación paso a paso (ejemplo concreto para un junior)**n1) Crear `src/js/storage.js` con el helper `storage` (ver snippet arriba).
2) En `catalogo.html`, añadir un script al final del `body` que cargue `src/js/products.js` y `src/js/cart.js`.
3) Implementa `initProducts()` que inicializa `fr_products` si está vacío. Puedes tomar datos de ejemplo desde `docs/` o crear un array de productos de ejemplo.
4) Implementa la función `renderProducts()` que recorra `fr_products` y genere el HTML con botones: `<button class="add-to-cart" data-product-id="...">Agregar</button>`.
5) En `cart.js`, escucha clicks sobre `.add-to-cart`, obtiene `productId` y llama a `addToCart(productId, 1)`.
6) Cada función que muta datos debe llamar a `storage.set(...)` y luego `renderCart()` o `renderOrders()` según corresponda.
7) Para `placeOrder()`: valida que `fr_cart.items.length > 0`, crea la orden con `orderId` único, la añade a `fr_orders`, borra `fr_cart` y muestra confirmación al usuario.

---

**Consejos prácticos y buenas prácticas**
- Nombres claros: usa nombres de funciones descriptivos (`addToCart`, `saveOrders`).
- Reducir duplicación: crea helpers comunes para formateo de fechas y generación de IDs.
- Guardar versiones: antes de cambios mayores, exporta `localStorage` para pruebas (puedes descargar JSON desde consola).
- Logging: mientras desarrollas, usa `console.log` para ver el estado (pero elimina logs excesivos antes de entregar).

---

**Ejemplo mínimo de `addToCart`**
```js
function addToCart(productId, qty = 1) {
  const cart = storage.get('fr_cart', { items: [], subtotal: 0 });
  const product = getProductById(productId);
  if (!product) throw new Error('Producto no encontrado');
  const existing = cart.items.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({ productId, quantity: qty, price: product.price });
  }
  cart.subtotal = cart.items.reduce((s, it) => s + it.quantity * it.price, 0);
  storage.set('fr_cart', cart);
  renderCart();
}
```

---

**Checklist rápida por fase (para marcar tareas en progreso)**
- Fase 1:
  - [ ] storage.js creado
  - [ ] products.js creado
  - [ ] cart.js creado
  - [ ] catalogo.html enlazado con scripts
  - [ ] Flujo: ver productos → agregar al carrito → hacer pedido
- Fase 2:
  - [ ] orders.js creado
  - [ ] páginas admin muestran y permiten actualizar órdenes
- Fase 3:
  - [ ] reports.js creado
  - [ ] reportes visibles y verificables
- Fase 4:
  - [ ] Validaciones implementadas
  - [ ] Documentación final completada

---

Si quieres, puedo:
- Generar los archivos base `src/js/storage.js`, `src/js/products.js`, `src/js/cart.js` con plantilla funcional.
- Mapear cada tarea a líneas o secciones en los archivos HTML actuales.

Dime si quieres que continúe creando los archivos JS base y conectándolos con `catalogo.html` ahora.