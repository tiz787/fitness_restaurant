#  Tech Stack & Roadmap Tecnol�gico: Fitness Restaurant

## 1. Introducci�n al Ecosistema T�cnico
Para garantizar una aplicaci�n r�pida, segura y mantenible, hemos seleccionado un stack moderno basado en componentes y servicios en la nube. La transici�n gradual de un prototipo est�tico a una aplicaci�n de p�gina �nica (SPA) con persistencia real asegura una validaci�n continua del producto.

---

## 2. Fase 1: Maquetaci�n y Prototipado (HTML/CSS)
El objetivo es definir la estructura sem�ntica y la respuesta visual del Dashboard.

*   **HTML5**: Uso de etiquetas sem�nticas (`<main>`, `<section>`, `<nav>`, `<article>`) para SEO t�cnico y accesibilidad nativa.
*   **CSS3 Moderno**: 
    *   **Flexbox & CSS Grid**: Para layouts complejos como el Dashboard y las tablas de pedidos.
    *   **Custom Properties (Variables)**: Para centralizar el sistema de dise�o (colores, sombras, espaciado).
    *   **Metodolog�a BEM**: Para mantener especificidad baja y estilos modulares.
*   **Icons**: FontAwesome o Lucide para prototipado r�pido.

---

## 3. Fase 2: L�gica de Negocio (React + TypeScript)
Transformamos el prototipo en una herramienta interactiva.

*   **React 18**: Librer�a principal basada en componentes funcionales.
*   **TypeScript**: Tipado est�tico para reducir errores en tiempo de desarrollo.
*   **Vite**: Build tool ultrarr�pida que reemplaza el anticuado Create React App.
*   **Gesti�n de Estado**:
    *   **React Context API**: Para el estado global simple (Carrito de compras, Usuario logueado).
    *   **React Hooks**: `useReducer` para l�gica compleja de �rdenes y `useEffect` para sincron�a.
*   **Validaci�n de Formularios**: Formik o React Hook Form con **YUP / ZOD**.

---

## 4. Fase 3: Backend & Persistencia (Firebase)
Llevamos la aplicaci�n a producci�n con datos reales.

*   **Firebase Hosting**: Despliegue seguro con SSL autom�tico y CDN global.
*   **Cloud Firestore**: Base de datos NoSQL documental con actualizaciones en tiempo real (vital para que cocina vea pedidos al instante).
*   **Firebase Authentication**: Login social y por email, gesti�n de sesiones y tokens JWT autom�ticos.
*   **Cloud Functions**: (Opcional) Para l�gica que no debe ejecutarse en el cliente, como cierres de caja a medianoche o generaci�n de PDFs.

---

## 5. Herramientas de Desarrollo (DevTools)

*   **Control de Versiones**: Git & GitHub (GitFlow como est�ndar de ramas).
*   **Linters & Formatos**: ESLint y Prettier para consistencia de c�digo.
*   **Pruebas (Testing)**:
    *   **Vitest**: Para unit tests de l�gica de c�lculo de precios.
    *   **Cypress**: Para pruebas E2E del flujo de una orden (Desde selecci�n hasta completado).

---

## 6. Estrategia de Seguridad 
1.  **Reglas de Firestore**: Limitar lectura/escritura solo a usuarios autenticados con rol de `ADMIN` o `STAFF`.
2.  **Sanitizaci�n**: Validaci�n de datos en el cliente y en la base de datos para evitar inyecciones.
3.  **Variables de Entorno**: Configuraci�n sensible (API Keys) manejada v�a `.env` y nunca subida al repositorio p�blico.

---

## 7. Preguntas Estrat�gicas para el Cliente (Tecnolog�a)

1.  **Disponibilidad Offline?**: Es cr�tico que la app funcione si se cae el internet por unos minutos (Progressive Web App - PWA)?
2.  **Hardware de Salida?**: Los dispositivos de toma de pedidos ser�n iPads, Android Tablets o laptops? (Influye en el motor de renderizado).
3.  **Carga de Im�genes?**: Las fotos de los platos se subir�n desde el dashboard o usaremos URLs de bancos de im�genes externos?
4.  **Frecuencia de Actualizaci�n?**: Cada cu�nto tiempo desean recibir nuevas funcionalidades tras el lanzamiento inicial?
5.  **Integraci�n con Delivery Externo?**: Desean que en el futuro la app reciba pedidos autom�ticos de UberEats o Rappi?
6.  **Soporte para Navegadores?**: Es necesario dar soporte a versiones antiguas de Internet Explorer o Safari?
7.  **Almacenamiento de Hist�ricos?**: Por cu�nto tiempo desean guardar los registros de ventas antes de archivarlos?
8.  **Notificaciones de Sistema?**: Desean avisos en el navegador cuando se est� perdiendo la conexi�n a base de datos?
9.  **Anal�tica Externa?**: Debemos integrar Google Analytics para medir qu� secciones del dashboard usa m�s el personal?
10. **Presupuesto de Infraestructura?**: Conocen los l�mites de la capa gratuita de Firebase o prefieren un plan de pago desde el d�a 1?

---

## 8. Presupuesto de Rendimiento (Performance Targets)
- **Time to Interactive (TTI)**: < 3.5s en 4G promedio.
- **Lighthouse Score**: > 90 en Performance, Accessibility y Best Practices.
- **Bundle Size**: < 200KB (Gzipped) para la carga inicial.

---

## 9. Monitoreo y Mantenimiento
Se utilizar� **Sentry** para el reporte de errores en tiempo real y **Firebase Crashlytics** (si se encapsula en Capacitor) para fallos cr�ticos fuera del entorno web puro.

---

## 10. Notas T�cnicas Adicionales
Se recomienda el uso de un paradigma de **Arquitectura Limpia** (Clean Architecture) para separar la l�gica de Firebase de los componentes de React, facilitando un posible cambio de proveedor de base de datos en el futuro (ej. a PostgreSQL o Supabase).
