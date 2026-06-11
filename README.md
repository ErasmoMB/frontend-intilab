# INTI-LAB Frontend

Frontend moderno construido con React para la visualización interactiva de investigadores y sus datos académicos. Integra Scopus API y proporciona un panel administrativo completo.

## Características Principales

- 🎠 **Slider interactivo** de investigadores con Swiper
- 📊 **Gráficos dinámicos** con Highcharts
- 👨‍💼 **Panel administrativo** para gestionar investigadores
- 🔐 **Autenticación** con JWT
- 📱 **Diseño responsivo** con Tailwind CSS
- ⚡ **Optimización de rendimiento** con lazy loading
- 🔄 **Actualización de datos** desde el panel admin

## Estado de Integración con Scopus API

La aplicación utiliza la **Scopus Search API** (`/content/search/scopus`) con API Key de **nivel gratuito (Level 1)**. Esto define qué datos se obtienen en vivo y cuáles son estáticos.

### ✅ Datos obtenidos en vivo desde Scopus (actualizables)

| Dato | Endpoint | Cómo se obtiene |
|------|----------|-----------------|
| **Documentos por autor** | `GET /api/scopus/documents?au_id=X` | Search API con `AU-ID(X)` y `count=200`. Se cuentan los papers devueltos. |
| **Citas por documento** | (misma llamada) | Suma del campo `citedby-count` de cada documento devuelto. |
| **Total de documentos por autor** | `GET /api/scopus/authors` | Search API con `AU-ID(X)` y `count=1`. Se lee `opensearch:totalResults`. |

### ❌ Datos NO disponibles con Level 1 (estáticos desde caché)

| Dato | Causa | Solución |
|------|-------|----------|
| **Áreas temáticas por investigador** (`subject-area`) | Solo disponible en Author Retrieval API (requiere Level 2). | Se usa un `autores_areas.json` estático generado desde un proyecto anterior que sí tenía Level 2. **No se puede actualizar en vivo.** |
| `cited-by-count` a nivel de autor | El Author Retrieval API devuelve citas agregadas; el Search API solo da citas por paper. | Se calcula sumando `citedby-count` de cada documento individual. |

### ⚠️ Limitaciones del tier gratuito

- **Rate limit**: ~20 requests por minuto. Al actualizar 22 autores secuencialmente se puede alcanzar el límite, por lo que se implementó:
  - Delay de **3 segundos** entre cada consulta de documentos
  - **Reintento automático** (hasta 3 veces) si un autor retorna 0 documentos
  - Botón **"Reintentar"** individual por cada autor en la vista de actualización
- **Sin acceso** a Author Retrieval API ni Abstract Retrieval API

### Flujo de actualización de datos

1. En el panel admin, sección **"Actualizar Datos"** → botón **"Ejecutar"**
2. Se llama a `GET /api/scopus/authors` → guarda en `cache/autores.json`
3. Por cada autor, se llama a `GET /api/scopus/documents?au_id=X` → guarda en `cache/documentos.json`
4. Los endpoints de lectura (`/api/datos/authors`, `/api/datos/documents`) sirven estos archivos cacheados
5. El dashboard y slider consumen los endpoints de caché, no Scopus directamente

## Mejoras y Nuevas Funcionalidades

- **Página "Actualizar Datos"** en el panel admin (`/admin/actualizar-datos`) con tabla en vivo, reintento por autor y resumen de resultados
- **Reintento individual** por investigador si la consulta falla (botón "Reintentar" por fila)
- **Gráficos de áreas temáticas** restaurados desde archivo estático (`autores_areas.json`) tanto en el slider individual como en el dashboard
- **Endpoint separado** `GET /api/datos/authors/areas` para servir datos de áreas temáticas sin mezclarlos con el caché actualizable
- **Eliminación** del botón "Actualizar" del slider público (ahora solo desde el panel admin)
- **Eliminación** del endpoint `/diagnostico-areas-tematicas` (reemplazado por la vista integrada en el admin)

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
