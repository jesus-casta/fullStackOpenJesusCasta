# Bloglist Part 7

Ejercicios 7.7-7.20 con la variante Zustand.

Cambios:

- `backend` y `frontend` viven juntos en `part7/bloglist`, con `package.json` separados.
- El backend sirve `backend/dist` en produccion y el frontend construye ahi con Vite.
- `Blog` tiene `comments` y endpoint `POST /api/blogs/:id/comments`.
- `frontend/src/stores`: Zustand para notificaciones, usuario logueado y blogs.
- `frontend/src/services/persistentUser.js`: acceso unico a `localStorage`.
- `frontend/src/hooks/index.js`: `useField` usado en formularios.
- Rutas: blogs, blog individual, usuarios, usuario individual, login, crear y `Page not found`.
- `ErrorBoundary` deja la barra de navegacion fuera y protege el contenido de rutas.
- Prettier queda configurado con `.prettierrc` y script `npm run format`.

Comandos utiles:

```sh
cd backend && npm run dev
cd frontend && npm run dev
cd frontend && npm run build
cd backend && npm start
```
