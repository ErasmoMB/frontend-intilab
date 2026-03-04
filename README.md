# INTI-LAB Frontend

Frontend moderno construido con React para la visualización interactiva de investigadores y sus datos académicos. Integra Scopus API y proporciona un panel administrativo completo.

## Características Principales

- 🎠 **Slider interactivo** de investigadores con Swiper
- 📊 **Gráficos dinámicos** con Highcharts y ECharts
- 👨‍💼 **Panel administrativo** para gestionar investigadores
- 🔐 **Autenticación** con JWT
- 📱 **Diseño responsivo** con Tailwind CSS
- ⚡ **Optimización de rendimiento** con lazy loading

## Estructura del Proyecto

```
frontend-intilab/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── api/                 # Configuración y servicios API
│   │   ├── config/
│   │   │   ├── axios.js     # Configuración de Axios
│   │   │   └── endpoints.js # Endpoints de la API
│   │   ├── services/        # Servicios de API REST
│   │   │   ├── auth.service.js
│   │   │   ├── datos.service.js
│   │   │   └── ...
│   │   └── utils/
│   │       └── retryRequest.js
│   ├── assets/              # Imágenes y recursos estáticos
│   │   └── Logos/
│   ├── components/          # Componentes React reutilizables
│   │   ├── common/          # Componentes comunes (Loading, Error)
│   │   ├── features/        # Componentes específicos de características
│   │   │   └── authors/     # Slider y detalles de autores
│   │   │   └── dashboard/   # Gráficos y estadísticas
│   │   └── layout/          # Layout (Navbar, Sidebar, Footer)
│   ├── config/              # Configuración global
│   │   └── index.js         # Config de API, rutas, validación
│   ├── contexts/            # Context API
│   │   └── AuthContext.js   # Contexto de autenticación
│   ├── hooks/               # Custom hooks
│   │   ├── useApi.js
│   │   ├── useAuth.js
│   │   ├── useAutores/
│   │   └── useInstitucion/
│   ├── pages/               # Páginas principales
│   │   ├── AdminConfiguracion.js
│   │   ├── AdminDashboard.js
│   │   ├── AdminInvestigadores.js
│   │   └── LoginPage.js
│   ├── routes/              # Configuración de rutas
│   │   ├── index.js
│   │   └── ProtectedRoute.js
│   ├── utils/               # Utilidades generales
│   │   ├── constants.js
│   │   ├── dataHelpers.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── performance.js
│   ├── __tests__/           # Tests unitarios
│   ├── App.js              # Componente principal
│   ├── index.js            # Entrada de la aplicación
│   ├── index.css           # Estilos globales
│   └── setupTests.js       # Configuración de tests
├── package.json
├── tailwind.config.js      # Configuración Tailwind CSS
├── postcss.config.js       # Configuración PostCSS
└── .env                    # Variables de entorno
```

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=60000
```

### 3. Ejecutar el proyecto

```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`

## Scripts disponibles

- `npm start` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm test` - Ejecuta tests
- `npm eject` - Expone configuración de Create React App (irreversible)

## Tecnologías Principales

- **React 18** - Interfaz de usuario
- **Tailwind CSS** - Estilos
- **Axios** - Peticiones HTTP
- **React Router** - Navegación
- **Swiper** - Slider de investigadores
- **Highcharts/ECharts** - Gráficos
- **Bootstrap** - Componentes UI
