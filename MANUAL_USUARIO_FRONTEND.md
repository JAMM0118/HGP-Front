# Manual de Usuario - Frontend HGP

## 1. Descripción general

Este proyecto es el frontend del sistema HGP construido con Angular 19. Proporciona una interfaz para:

- iniciar sesión y registrar usuarios
- navegar un dashboard de análisis inmobiliario
- cargar datos de propiedades y visualizar métricas
- mostrar insights de mercado y comparativas geoespaciales
- acceder a modelado predictivo y métricas de rendimiento ML (según perfil de usuario)

## 2. Requisitos

- Node.js 20+ / 18+ compatible
- npm 10+ o yarn
- Angular CLI (se puede usar local desde `npm run`)
- Backend HGP corriendo en `http://localhost:5000` (por defecto)

## 3. Instalación

1. Abrir una terminal en la carpeta `HGP-Front`.
2. Instalar dependencias:

```powershell
npm install
```

## 4. Ejecución en desarrollo

Para iniciar la aplicación en modo desarrollo:

```powershell
npm start
```

Angular servirá la aplicación en `http://localhost:4200` por defecto.

## 5. Compilación para producción

Para generar los archivos de producción:

```powershell
npm run build
```

Los archivos generados quedarán en `dist/hgp-front`.

## 6. Estructura principal del proyecto

- `angular.json` - configuración de build y serve.
- `package.json` - scripts y dependencias del proyecto.
- `src/main.ts` - arranque de Angular.
- `src/app/app.config.ts` - configura rutas, HttpClient y el interceptor de autenticación.
- `src/app/app.routes.ts` - define las rutas de la aplicación.
- `src/app/auth/` - componentes de login y registro.
- `src/app/dashboard/` - página principal del dashboard y componentes de análisis.
- `src/app/services/` - servicios para autenticación y consumo de datos.
- `src/app/interceptors/auth.interceptor.ts` - añade el token JWT a las solicitudes.
- `src/app/guards/auth.guard.ts` - obliga a autenticarse antes de acceder a `/dashboard`.

## 7. Rutas y navegación

Las rutas principales de la aplicación son:

- `/login` - pantalla de inicio de sesión.
- `/register` - pantalla de registro de nuevos usuarios.
- `/dashboard` - panel principal protegido por autenticación.

Si no hay sesión activa, la aplicación redirige automáticamente a `/login`.

## 8. Autenticación y gestión de sesión

### Registro

- En `src/app/auth/register/register.ts` se crea una cuenta con:
  - `name`
  - `email`
  - `password`
  - `confirmPassword`
  - `userType` (`administrador`, `analista_datos` o `invitado`)
  - `acceptTerms`

Después del registro exitoso, redirige automáticamente al dashboard.

### Login

- En `src/app/auth/login/login.ts` se valida con:
  - `email`
  - `password`

Al iniciar sesión exitosamente se guarda en `localStorage`:

- `currentUser`
- `authToken`

Esto permite mantener la sesión y enviar el token en las solicitudes.

### Logout

El logout se realiza desde el dashboard con `AuthService.logout()`.

## 9. Servicios y conexión al backend

### `AuthService`

Ubicación: `src/app/services/auth.service.ts`

Este servicio usa la URL base:

```ts
private apiUrl = 'http://localhost:5000/api/auth';
```

Endpoints utilizados:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### `PropertyService`

Ubicación: `src/app/services/property.service.ts`

Este servicio usa la URL base:

```ts
private apiUrl = 'http://localhost:5000/api/csv';
```

Endpoints consumidos:

- `POST /api/csv/upload`
- `GET /api/csv/avg-price-by-city`
- `GET /api/csv/property-analysis-stats`
- `GET /api/csv/price-distribution-stats`
- `GET /api/csv/market-trend-stats`
- `GET /api/csv/market-insights`
- `GET /api/csv/area-comparison-stats`
- `GET /api/csv/price-vs-area-stats`
- `GET /api/csv/price-vs-bedrooms-stats`
- `GET /api/csv/correlation-matrix-data`
- `GET /api/csv/top-cities-stats`
- `GET /api/csv/top-barrio-growth-stats`
- `GET /api/csv/heatmap-stats`

> Nota: algunos endpoints del frontend usan descripciones de rutas del estilo `/api/properties/...`, pero en el código actual la base real está configurada con `/api/csv`.

## 10. Seguridad de solicitudes

El interceptor `src/app/interceptors/auth.interceptor.ts` agrega el header:

```http
Authorization: Bearer <token>
```

a todas las peticiones HTTP si hay token en `localStorage`.

## 11. Componentes del dashboard

El dashboard principal en `src/app/dashboard/pages/dashboard/dashboard.ts` ofrece módulos:

- Resumen Ejecutivo
- Análisis de Datos
- Inteligencia Geoespacial
- Modelado Predictivo
- Rendimiento ML
- Insights del Dataset
- Tabla de Datos

### Permisos por rol

Algunas secciones solo están disponibles para ciertos roles:

- `administrador`
- `analista_datos`

Los usuarios `invitado` acceden a vistas más limitadas.

## 12. Cómo cambiar la URL del backend

Si el backend no se ejecuta en `http://localhost:5000`, actualiza las propiedades `apiUrl` en:

- `src/app/services/auth.service.ts`
- `src/app/services/property.service.ts`

## 13. Comandos útiles

- `npm install` - instalar dependencias.
- `npm start` - ejecutar en modo desarrollo.
- `npm run build` - compilar para producción.
- `npm test` - ejecutar pruebas (si se configuran pruebas adicionales).

## 14. Notas adicionales

- La aplicación utiliza Angular standalone components y no requiere módulos tradicionales para los componentes principales.
- Se usa Tailwind CSS para estilos globales y diseño.
- El layout del dashboard está compuesto por componentes reutilizables en `src/app/dashboard/components/`.
- El guard `AuthGuard` protege la ruta `/dashboard` y redirige al login en caso de sesión inválida.

---

**Fin del manual**
