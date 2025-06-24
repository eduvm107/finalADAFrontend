# Sistema de Reporte de Incidentes - Frontend

## Descripción
Sistema web moderno para reportar y gestionar incidentes de seguridad con interfaz React/TypeScript, integración de mapas interactivos y conexión a backend .NET.

## Características principales

### 🗺️ **Mapa Interactivo**
- Visualización de incidentes en tiempo real usando Leaflet/OpenStreetMap
- Ubicación automática GPS
- Marcadores por tipo de incidente

### 📝 **Reporte de Incidentes**
- Formulario intuitivo para reportar incidentes
- Soporte para reportes anónimos o con identificación
- Categorización por tipo (Robo, Emergencia Médica, Violencia Familiar, Incendio, Otro)
- Detección automática de ubicación

### 💬 **Foro de Reportes**
- Visualización de todos los incidentes reportados
- Sistema de filtros por tipo y búsqueda
- Actualización en tiempo real

### 🚨 **Contactos de Emergencia**
- Lista de entidades de emergencia cercanas
- Información de contacto rápido

### 📊 **Análisis de Datos**
- Panel de análisis de zonas calientes
- Estadísticas de incidentes por área

## Tecnologías utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Leaflet** para mapas interactivos
- **Lucide React** para iconografía
- **Axios** para comunicación con API
- **Webpack 5** como bundler

### Backend (Integración)
- **.NET Core** con arquitectura limpia
- **SQL Server** como base de datos
- **JWT** para autenticación
- **CORS** configurado para desarrollo

## Instalación y configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- Backend .NET Core corriendo en `http://localhost:5262`

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/eduvm107/finalADAFrontend.git
   cd finalADAFrontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar polyfills de Webpack 5**
   ```bash
   npm install stream-http https-browserify util browserify-zlib stream-browserify crypto-browserify url assert
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

5. **Acceder a la aplicación**
   - Abrir http://localhost:3000 en el navegador

## Estructura del proyecto

```
src/
├── api/
│   └── endpoints.ts          # Comunicación con backend
├── components/
│   ├── IncidentForm.tsx      # Formulario de reporte
│   ├── IncidentForum.tsx     # Foro de incidentes
│   ├── IncidentMap.tsx       # Mapa interactivo
│   ├── EmergencyContacts.tsx # Contactos de emergencia
│   ├── AnalyticsPanel.tsx    # Panel de análisis
│   └── NearestEntities.tsx   # Entidades cercanas
├── styles/
│   └── global.css           # Estilos globales
├── utils/
│   ├── algorithms.ts        # Algoritmos de procesamiento
│   └── data.ts             # Datos estáticos
└── index.tsx               # Punto de entrada

public/
├── index.html              # Plantilla HTML
└── favicon.ico            # Icono de la aplicación

sql/
└── incident_reporting_db.sql # Script de base de datos

Core/
└── Interfaces/             # Interfaces para backend .NET
```

## API Endpoints

### Incidentes
- `GET /api/Incidents` - Obtener todos los incidentes
- `POST /api/Incidents` - Crear nuevo incidente

### Contactos de Emergencia
- `GET /api/EmergencyContacts` - Obtener contactos
- `POST /api/EmergencyContacts` - Crear contacto

## Configuración del Backend

El frontend se conecta por defecto a:
```
http://localhost:5262/api
```

Para cambiar la URL del backend, editar `src/api/endpoints.ts`:
```typescript
const BASE_URL = 'http://tu-backend-url/api';
```

## Scripts disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm test` - Ejecutar pruebas

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## Contacto

Eduardo VM - [@eduvm107](https://github.com/eduvm107)

Link del proyecto: [https://github.com/eduvm107/finalADAFrontend](https://github.com/eduvm107/finalADAFrontend)
