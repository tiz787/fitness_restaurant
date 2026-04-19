# Fitness Restaurant Dashboard - Project Management

Bienvenido al proyecto **Fitness Restaurant**, una plataforma web diseñada para la gestión eficiente de un restaurante saludable. Este proyecto sigue la metodología **DDD (Document Driven Development)**, donde la documentación es el motor que guía el desarrollo.

## 📜 Reglas de Oro del Proyecto
1. **Documentación Primero**: Ninguna funcionalidad debe ser implementada sin antes estar documentada en la carpeta `docs/`.
2. **README como Fuente de Verdad**: Este archivo debe mantenerse actualizado con un resumen de cada decisión tomada y referenciar directamente al documento específico.
3. **Mantenimiento**: Cada vez que se realice un cambio significativo en el diseño o funcionalidad, se debe actualizar el README y el archivo `.md` correspondiente.

---

## 🚀 Estado del Proyecto y Decisiones

### 1. Visión General
El proyecto consiste en un Dashboard administrativo para un restaurante saludable. Permite gestionar platillos (CRUD), tomar órdenes en tiempo real y visualizar estadísticas de ventas.

### 2. Stack Tecnológico (Fases)
- **Fase 1 (Actual)**: Maquetación profesional con HTML5 y CSS3 puro. Enfoque en accesibilidad y diseño responsivo.
- **Fase 2**: Migración a **React** con **TypeScript** para lógica de componentes y tipado estricto.
- **Fase 3**: Integración con **Firebase** para base de datos (Firestore) y autenticación de usuarios (Auth).
- *Detalles en: [tech_stack.md](docs/tech_stack.md)*

### 3. Paleta de Colores y Estilo
Se ha seleccionado una paleta vibrante que evoca frescura y energía:
- Primarios: Verdes (#396c03, #d8d92e)
- Acentos: Naranjas y Amarillos (#ff4a01, #ff8b00, #ffd900)
- *Detalles en: [sistema_de_diseño.md](docs/sistema_de_diseño.md)*

### 4. Estructura de Usuarios
- **Inicial**: Acceso público para desarrollo de UI.
- **Final**: Roles diferenciados mediante Firebase Auth (Admin para estadísticas/CRUD, Staff para órdenes).
- *Detalles en: [alcance_del_proyecto.md](docs/alcance_del_proyecto.md)*

---

## 📂 Organización de Documentación
- [Alcance del Proyecto](docs/alcance_del_proyecto.md): Definición de requerimientos y objetivos.
- [Sistema de Diseño](docs/sistema_de_diseño.md): Guía de estilos, colores y componentes.
- [Tech Stack](docs/tech_stack.md): Tecnologías y roadmap de aprendizaje.
- [Arquitectura del Proyecto](docs/arquitectura_del_proyecto.md): Estructura de archivos y flujo de datos.

---

## 🛠 Instalación y Uso
*Instrucciones pendientes conforme avance el desarrollo de la Fase 2.*