# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Frontend - Carpincho Alerta

Este directorio contiene el frontend del sistema Carpincho Alerta, desarrollado con React y Vite. El objetivo principal del frontend es proporcionar una interfaz de usuario intuitiva para monitorear y prevenir incendios en la provincia de Corrientes, Argentina.

## Funcionalidades Actuales

- **Autenticación de Usuarios:**
  - Formulario de inicio de sesión y registro.
  - Manejo de tokens JWT para autenticación.
- **Dashboard Principal:**
  - Visualización de focos de calor activos obtenidos de FIRMS (NASA).
  - Análisis histórico de incendios y vegetación (NDVI) utilizando Google Earth Engine.
  - Listado de alertas activas.
- **Componentes Reutilizables:**
  - Uso de `react-bootstrap` para una interfaz moderna y responsiva.
  - Componentes como formularios, listas y alertas.

## Tecnologías Utilizadas

- **React:** Biblioteca principal para la construcción de la interfaz de usuario.
- **Vite:** Herramienta de desarrollo para un entorno rápido y moderno.
- **React-Bootstrap:** Para estilos y componentes predefinidos.
- **Axios:** Para realizar solicitudes HTTP al backend.

## Próximos Pasos

- **Integración de Mapas:**
  - Mostrar focos de calor y análisis NDVI en un mapa interactivo.
- **Mejoras en la Experiencia de Usuario:**
  - Validaciones más robustas en formularios.
  - Indicadores visuales para estados de carga y errores.
- **Optimización de Código:**
  - Refactorización de componentes para mejorar la reutilización.
  - Implementación de un estado global (ej. Redux o Context API).
- **Soporte Multilenguaje:**
  - Añadir soporte para múltiples idiomas (español e inglés).

## Configuración y Ejecución

1. **Instalar Dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar el Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

3. **Construir para Producción:**
   ```bash
   npm run build
   ```
   Los archivos generados estarán en el directorio `dist/`.

4. **Previsualizar la Construcción:**
   ```bash
   npm run preview
   ```

## Notas Adicionales

- Asegúrate de que el backend esté corriendo para que las funcionalidades dependientes de la API funcionen correctamente.
- Si encuentras problemas con dependencias como `react-bootstrap`, verifica que estén instaladas correctamente ejecutando:
  ```bash
  npm install react-bootstrap bootstrap
  ```
