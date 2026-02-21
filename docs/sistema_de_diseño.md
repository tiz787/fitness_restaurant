#  Sistema de Dise�o: Fitness Restaurant

## 1. Identidad Visual y Concepto
El sistema de dise�o de **Fitness Restaurant** busca transmitir frescura, energ�a y salud. La combinaci�n de tonos naranjas vibrantes con verdes org�nicos crea una atm�sfera que estimula el apetito saludable y comunica vitalidad.

---

## 2. Paleta de Colores 

| Color | Hex | Funci�n | Significado Psicol�gico |
| :--- | :--- | :--- | :--- |
| **Naranja At�mico** | `#ff4a01` | Primario - Botones de acci�n (CTA), Logos | Energ�a, Urgencia, Apetito |
| **Naranja C�lido** | `#ff8b00` | Secundario - Acentos, Hover states | Amistad, Accesibilidad |
| **Verde Bosque** | `#396c03` | �xito, Salud, Vegetariano/Vegan | Naturaleza, Frescura, Confianza |
| **Lima El�ctrica** | `#d8d92e` | Destacados, Warning suave, Fondos | Atenci�n, Modernidad |
| **Amarillo Solar** | `#ffd900` | Resaltado de precios, Tags | Felicidad, Optimismo |

### Colores Neutros
- **Fondo Principal**: `#f8f9fa` (Gris ultra claro para limpieza).
- **Texto Principal**: `#212529` (Casi negro para lecturabilidad).
- **Bordes/Divisores**: `#dee2e6`.

---

## 3. Tipograf�a 
Utilizaremos fuentes sans-serif modernas para asegurar la legibilidad en pantallas de alta densidad y bajo brillo (cocinas).

*   **Principal**: `Inter` o `Roboto`.
    *   **Headings**: Bold (700) - `#212529`.
    *   **Body**: Regular (400) - `#495057`.
    *   **Precios**: Medium (500) - `#396c03`.

### Escala de Tama�os
- **H1 (T�tulo de P�gina)**: 2.5rem
- **H2 (Subt�tulos)**: 1.75rem
- **H3 (Cards)**: 1.25rem
- **Body**: 1rem (16px)
- **Small (Ingredientes)**: 0.875rem

---

## 4. Componentes de Interfaz (UI)

### 4.1. Botones (Buttons)
1.  **Bot�n Primario (`#ff4a01`)**: Se usa para "Guardar Orden" o "Crear Platillo". Esquinas redondeadas (8px) para un look moderno.
2.  **Bot�n de Acci�n R�pida (`#396c03`)**: El bot�n "Hecho" en la gesti�n de pedidos. Debe ser el m�s grande seg�n la Ley de Fitts.
3.  **Bot�n de Cancelar**: Outline gris con texto rojo para evitar acciones destructivas accidentales.

### 4.2. Tarjetas de Platillos (Cards)
- **Imagen**: Proporci�n 16:9 con zoom suave al hacer hover.
- **Badge de Categor�a**: Usar colores de la paleta seg�n tipo (Verde para ensaladas, Naranja para prote�nas).
- **Sombra (Shadow)**: `shadow-sm` que pasa a `shadow-md` en interacci�n.

### 4.3. Campos de Formulario (Inputs)
- **Focus state**: Border color `#ff8b00` con `ring` suave.
- **Validaci�n**: Mensajes de error en rojo `#dc3545` con iconos de advertencia.

---

## 5. Principios de UX y Dise�o

1.  **Mobile-First**: El dashboard debe ser 100% funcional en smartphones para meseros en movimiento.
2.  **Ley de Fitts**: Los elementos interactivos m�s frecuentes (como el selector de cantidad) deben estar en zonas de f�cil alcance para el pulgar.
3.  **Feedback Instant�neo**: Cada click en el carrito debe disparar una micro-animaci�n de confirmaci�n.
4.  **Carga Cognitiva M�nima**: No mostrar m�s de 8 platos por pantalla sin scroll para evitar la par�lisis de decisi�n del staff.

---

## 6. Accesibilidad (A11y) 
Nuestro objetivo es cumplir con **WCAG 2.1 Nivel AA**:

- **Contraste**: Todos los textos deben tener un contraste m�nimo de 4.5:1.
- **Focus Indicators**: Nunca eliminar el outline de enfoque; estilizarlo para que combine con la marca.
- **Alt Text**: Todas las im�genes de comida deben tener descripciones precisas.
- **Tama�o de Target**: M�nimo 44x44px para cualquier elemento clickeable.

---

## 7. Preguntas Estrat�gicas para el Cliente (Dise�o)

1.  **Tienen un manual de identidad previo?**: Debemos respetar alg�n logotipo o fuente espec�fica de su local f�sico?
2.  **Modo Oscuro?**: El personal de cocina prefiere una interfaz oscura para reducir la fatiga visual?
3.  **Visualizaci�n de Al�rgenos?**: Quieren iconos espec�ficos (gluten-free, vegan) para cada plato?
4.  **Fotos Reales?**: Cuentan con fotograf�a profesional de los platos o usaremos placeholders/iconos?
5.  **Personalizaci�n por Usuario?**: Los meseros pueden elegir el tama�o de la fuente en su dispositivo?
6.  **Vibraci�n (Haptic Feedback)?**: Desean que el dispositivo vibre al completar exitosamente una orden?
7.  **Sonidos de Alerta?**: Sugerimos un sonido suave de campana al llegar una nueva orden al dashboard?
8.  **Filtros de B�squeda?**: Qu� categor�as son las m�s usadas para filtrar (ej. 'M�s Prote�na', 'Bajo en Carb')?
9.  **Estilo de Iconograf�a?**: Prefieren iconos lineales (minimalistas) o rellenos (m�s visibles)?
10. **Publicidad Interna?**: Desean un espacio en el dashboard para promocionar el "Plato del D�a"?

---

## 8. Estados de Componentes

| Estado | Visual | Comportamiento |
| :--- | :--- | :--- |
| **Idle** | Estilo base | Esperando interacci�n |
| **Loading** | Esqueleto (Skeleton) | Indica carga de datos de Firestore |
| **Success** | Checkmark verde | Confirmaci�n de guardado |
| **Error** | Shake animation + Rojo | Error de validaci�n o red |
| **Disabled** | Opacidad 50% | Acci�n no permitida seg�n rol |

---

## 9. Iconograf�a sugerida
Usaremos la librer�a **Lucide Icons**:
-  `ChefHat` para el CRUD.
-  `ClipboardList` para �rdenes.
-  `TrendingUp` para estad�sticas.
-  `Settings` para configuraci�n.

---

## 10. Evoluci�n del Sistema
El sistema se documentar� en **Storybook** durante la Fase 2 para que los desarrolladores puedan probar los componentes de forma aislada antes de integrarlos al flujo de React.
