# Rick & Morty — Explorador de Episodios

Aplicación Angular 17 que consume la [Rick and Morty API](https://rickandmortyapi.com/) para explorar episodios de forma interactiva.

---

## Funcionalidades

- Listado de episodios con paginación
- Búsqueda por nombre en tiempo real (debounce 400ms)
- Filtro por temporada (S01 a S05)
- Modal de detalle con personajes del episodio
- Estados de carga, error y sin resultados
- Componente de error reutilizable
- Interceptor HTTP global de errores
- Diseño responsive

---

## Requisitos

- Node.js 18+
- Angular CLI 17+: `npm install -g @angular/cli`

---

## Instalación y ejecución

```bash
git clone <url-del-repositorio>
cd rick-and-morty-app

npm install
npm start