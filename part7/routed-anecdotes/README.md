# Routed Anecdotes

Ejercicios 7.1-7.6.

Cambios:

- `useField` vive en `src/hooks/index.js`, devuelve `input`, `value` y `reset`.
- La parte de `reset` no se pasa al `<input>`, asi se evita el warning del spread.
- `useAnecdotes` carga, crea y borra anecdotas contra JSON Server.
- Los componentes llaman `useAnecdotes()` directamente; `App` no pasa datos por props.
- Rutas: lista, detalle, creacion y about.
