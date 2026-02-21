#  Alcance del Proyecto: Fitness Restaurant Dashboard

## 1. Introducci�n y Prop�sito
El proyecto **Fitness Restaurant** surge como una soluci�n digital integral para la gesti�n operativa de establecimientos gastron�micos enfocados en el bienestar y la nutrici�n. En un mercado cada vez m�s competitivo, la eficiencia en la toma de pedidos y la precisi�n en la gesti�n del cat�logo de productos son diferenciadores clave. 

Este Dashboard no es solo una herramienta administrativa; es el n�cleo operativo que conecta la cocina con el sal�n y la administraci�n, garantizando que cada platillo servido cumpla con los est�ndares de calidad y rapidez que el cliente moderno espera.

---

## 2. Objetivos Estrat�gicos del Proyecto
Para asegurar el �xito de la implementaci�n, se han definido los siguientes pilares:

*   ** Optimizaci�n de Procesos**: Digitalizar el 100% de la toma de pedidos eliminando el uso de papel y reduciendo errores manuales.
*   ** Inteligencia de Negocio**: Proporcionar al administrador datos en tiempo real sobre el rendimiento de los productos para la toma de decisiones informadas.
*   ** Consistencia de Marca**: Mantener un cat�logo centralizado que asegure que la informaci�n nutricional e ingredientes sean coherentes en todo momento.
*   ** Escalabilidad**: Dise�ar una arquitectura modular que permita la integraci�n futura de m�dulos de inventario, pagos electr�nicos y fidelizaci�n de clientes.

---

## 3. Descripci�n Detallada de Funcionalidades

### 3.1. M�dulo de Gesti�n de Cat�logo (CRUD)
Este m�dulo es el coraz�n de la oferta gastron�mica. El administrador podr�:

1.  **Registro de Platillos**:
    *   **Nombre**: Identificador comercial �nico.
    *   **Descripci�n/Ingredientes**: Detalle completo para gesti�n de al�rgenos y transparencia nutricional.
    *   **Precio**: Gesti�n din�mica de costos.
    *   **Categorizaci�n**: Clasificaci�n por tipos (Ej: Desayunos, Almuerzos, Snacks, Bebidas Detox).
    *   **Estado de Disponibilidad**: Switch para activar/desactivar platos seg�n stock diario.
2.  **Visualizaci�n Avanzada**:
    *   Filtros por categor�a y rango de precios.
    *   Buscador en tiempo real por ingredientes o nombre.
3.  **Auditor�a**:
    *   Registro de qui�n realiz� la �ltima modificaci�n y en qu� fecha.

### 3.2. M�dulo de Gesti�n de Pedidos (Ordenes)
Dise�ado para la m�xima fluidez operativa en horas pico:

*   **Interfaz de Selecci�n**: Panel t�ctil optimizado para tablets con botones grandes.
*   **Gesti�n de Cantidades**: Incrementos r�pidos de unidades por plato.
*   **Resumen de Venta**: Visualizaci�n clara del subtotal, IVA y total final antes de confirmar.
*   **Flujo de Estados de la Orden**:
    *   `PENDIENTE`: La orden ha sido enviada a cocina.
    *   `PREPARANDO`: (Fase futura) La cocina ha aceptado la orden.
    *   `COMPLETADO`: La orden ha sido entregada y cobrada. Marcada mediante el checkbox "Hecho".
*   **Cancelaciones**: Sistema de borrado de �tems con validaci�n de seguridad para evitar errores accidentales.

### 3.3. Panel de Estad�sticas y Anal�tica
Transformamos datos en decisiones:

*   **KPI de Ingresos**: Sumatoria din�mica del d�a basada en �rdenes completadas.
*   **Top 3 Platillos Estrellas**: Ranking autom�tico basado en volumen de ventas.
*   **M�tricas de Volumen**: Total de �rdenes procesadas y promedio de ticket por cliente.
*   **Comparativa Temporal**: (Opcional) Comparaci�n contra el rendimiento del d�a anterior.

---

## 4. Perfiles de Usuario y Matriz de Permisos

| Funcionalidad | Invitado | Staff / Mesero | Administrador | SuperAdmin |
| :--- | :---: | :---: | :---: | :---: |
| Ver Men� P�blico |  |  |  |  |
| Crear �rdenes |  |  |  |  |
| Modificar Cat�logo |  |  |  |  |
| Ver Estad�sticas |  |  |  |  |
| Gesti�n de Usuarios |  |  |  |  |
| Eliminar Hist�rico |  |  |  |  |

---

## 5. Casos de Uso Cr�ticos

1.  **UC-01: Registro de Venta R�pida**: Un cliente pide un "Bowl de Quinoa". El mesero lo selecciona, ajusta a 2 unidades y pulsa "Guardar". La orden aparece en el dashboard.
2.  **UC-02: Actualizaci�n de Precio**: El precio de la prote�na sube. El administrador entra al CRUD, busca el plato y actualiza el precio. Las nuevas �rdenes reflejan el cambio instant�neamente.
3.  **UC-03: Cierre de Caja**: Al final del d�a, el administrador consulta el panel de estad�sticas para verificar que el efectivo/tarjetas coincidan con el "Total de Ingresos" reportado por la app.

---

## 6. Requisitos No Funcionales y Accesibilidad

*   **Rendimiento**: Carga inicial de la aplicaci�n en menos de 2 segundos.
*   **Seguridad**: Autenticaci�n robusta mediante Firebase Auth (Email/Google).
*   **Accesibilidad (A11y)**:
    *   Uso de etiquetas ARIA en todos los formularios.
    *   Contraste de colores cumpliendo est�ndares WCAG AA.
    *   Navegaci�n completa mediante teclado para usuarios con movilidad reducida.
*   **Dise�o Responsivo**: Soporte total desde smartphones de 5" hasta monitores de 27".

---

## 7. Preguntas Estrat�gicas para el Cliente (Discovery)

1.  **Manejan impuestos variables?**: El IVA est� incluido en el precio mostrado o se suma al final del ticket?
2.  **Soporte para m�ltiples sucursales?**: Necesitan cambiar de restaurante dentro de la misma cuenta?
3.  **Modificadores de platillos?**: Existen opciones como "Sin Cebolla" o "Extra Aguacate" con coste adicional?
4.  **Integraci�n con impresoras t�rmicas?**: Desean imprimir la comanda en cocina autom�ticamente al guardar la orden?
5.  **Gesti�n de propinas?**: El sistema debe sugerir o calcular porcentajes de propina?
6.  **Inventario en tiempo real?**: Desean que el stock de ingredientes baje autom�ticamente con cada venta?
7.  **M�todos de pago detallados?**: Debemos registrar si fue efectivo, tarjeta de cr�dito, d�bito o transferencia?
8.  **Sistema de reservas?**: Se planea integrar la gesti�n de mesas y reservas en una fase posterior?
9.  **Idiomas?**: El dashboard ser� operado �nicamente por personal que hable espa�ol o requieren biling�ismo?
10. **Exportaci�n de datos?**: Qu� formato prefieren para sus reportes contables: PDF, CSV o Excel?

---

## 8. Roadmap de Evoluci�n

### Fase 1: Prototipado y Shell UI (Q1 2026)
*   Definici�n de estilos de marca.
*   Maquetaci�n de las 3 vistas principales en HTML/CSS sem�ntico.
*   Pruebas de usabilidad en dispositivos m�viles.

### Fase 2: L�gica y Estado (Q2 2026)
*   Migraci�n a React con TypeScript.
*   Implementaci�n de Context API para gesti�n de �rdenes globales.
*   Validaci�n de formularios con Yup/Zod.

### Fase 3: Persistencia y Seguridad (Q3 2026)
*   Integraci�n con Firebase Firestore para datos en tiempo real.
*   Implementaci�n de Firebase Auth.
*   Despliegue inicial (MVP) en producci�n.

---

## 9. Glosario de T�rminos
*   **CRUD**: Create, Read, Update, Delete (Operaciones b�sicas de datos).
*   **Dashboard**: Panel de control visual.
*   **Staff**: Personal operativo del restaurante.
*   **MVP**: Minimum Viable Product (Producto M�nimo Viable).

---

## 10. Notas Finales
El �xito de este proyecto depende de la retroalimentaci�n constante del personal de piso. Se recomienda realizar una capacitaci�n de 2 horas tras cada despliegue de fase para asegurar la adopci�n tecnol�gica.
