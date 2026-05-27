# Rick & Morty — Explorador de Episodios

Aplicación **Angular 21** que consume la [Rick and Morty API](https://rickandmortyapi.com/)
para explorar todos los episodios de la serie de forma interactiva.

---

## Funcionalidades

| Funcionalidad | Detalle |
|---|---|
| Listado paginado | 20 episodios por página, navegación con controles |
| Búsqueda por nombre | Debounce de 400 ms, `distinctUntilChanged` |
| Filtro por temporada | Selector de S01 a S05 |
| Modal de detalle | Muestra hasta 12 personajes del episodio con imagen |
| Estados de UI | Loading spinner, banner de error, pantalla "sin resultados" |
| Interceptor HTTP | Manejo global de errores de red y HTTP |
| Diseño responsive | Mobile-first, breakpoints desde 480 px |

---

## Requisitos

| Herramienta | Versión |
|---|---|
| **Node.js** | `24.14.1` (LTS) |
| **npm** | `11.11.0` (incluido con Node) |
| **Angular CLI** | `21.2.12` |

> **Nota:** Angular 21 requiere Node ≥ 20. Se recomienda usar [nvm](https://github.com/nvm-sh/nvm)
> o [nvm-windows](https://github.com/coreybutler/nvm-windows) para gestionar versiones.

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd serie-front

# 2. Instalar Angular CLI de forma global (solo la primera vez)
npm install -g @angular/cli@21.2.12

# 3. Instalar dependencias del proyecto
npm install

# 4. Iniciar el servidor de desarrollo (http://localhost:4200)
npm start

# 5. Compilar para producción
npm run build
```

---

## Pruebas unitarias

El proyecto usa **Vitest** como runner de tests (integrado en Angular 21 via `@angular/build:unit-test`).

```bash
# Ejecutar todos los tests una vez
npm test

# Modo watch (re-ejecuta al guardar)
npx ng test --watch
```

### Cobertura de tests incluida

| Archivo | Qué se prueba |
|---|---|
| `episode.service.spec.ts` | Construcción de URL, parámetros de filtro, emisión de respuesta |
| `episode-state.service.spec.ts` | Signals, flujo de carga, errores, filtros, reset |
| `episode-card.component.spec.ts` | Renderizado de datos, getters, evento `selected` |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── interceptors/   # errorInterceptor (HTTP global)
│   │   ├── interfaces/     # Tipados de API (EpisodeApiResponse, EpisodeFilters)
│   │   ├── models/         # Episode, Character
│   │   ├── services/       # EpisodeService, CharacterService
│   │   └── utils/          # Helpers puros sin side-effects
│   ├── features/
│   │   ├── components/     # EpisodeCard, EpisodeFilters, EpisodeDetail, EpisodeList
│   │   ├── pages/          # EpisodesPage (punto de entrada de la ruta /)
│   │   └── services/       # EpisodeStateService (estado global de la vista)
│   └── shared/
│       └── component/      # LoadingSpinner, ErrorBanner, Pagination
└── environments/           # environment.ts / environment.prod.ts
```

---

## Decisiones técnicas relevantes

### Angular Signals para el estado
`EpisodeStateService` gestiona el estado de la vista con **Signals** (`signal`, `computed`)
en lugar de un BehaviorSubject o NgRx. Esto simplifica la reactividad sin overhead de store,
con lectura sincrónica y sin necesidad de `async pipe` en las plantillas.

### switchMap para cancelar peticiones en vuelo
Las llamadas HTTP se canalizan a través de un `Subject<LoadRequest>` procesado con `switchMap`.
Cuando el usuario escribe rápidamente o cambia filtros antes de que llegue la respuesta anterior,
el `switchMap` cancela la petición pendiente (unsubscribe) y lanza la nueva. Esto elimina las
condiciones de carrera donde una respuesta antigua podía pisar una más reciente.

### Interceptor HTTP funcional registrado con `withInterceptors`
Se usa el nuevo estilo funcional (`HttpInterceptorFn`) en lugar de la clase `HttpInterceptor`.
El interceptor se registra en `app.config.ts` con `provideHttpClient(withInterceptors([errorInterceptor]))`,
que es el único lugar donde Angular lo aplica realmente a todas las peticiones HTTP de la app.

### Doble request eliminado en resetFilters
El componente de filtros reseteaba el formulario (lo que disparaba `valueChanges` → `setFilters()`)
y además llamaba `state.resetFilters()` — dos peticiones para el mismo efecto. La corrección usa
`{ emitEvent: false }` al hacer `reset()`, de modo que solo `resetFilters()` genera la carga.

### Standalone Components + lazy loading
Todos los componentes son standalone (sin NgModule). La ruta raíz usa `loadComponent` para carga
diferida de `EpisodesPageComponent`, reduciendo el bundle inicial.

### Vitest como runner de tests
Angular 21 incorpora Vitest de forma nativa a través de `@angular/build:unit-test`.
Los tests usan `TestBed` con `provideHttpClientTesting` para interceptar peticiones HTTP
sin realizar llamadas reales a la API.

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `apiUrl` | Base URL de la Rick and Morty API | `https://rickandmortyapi.com/api` |

Los entornos se configuran en `src/environments/environment.ts` (dev) y
`src/environments/environment.prod.ts` (producción).
