# Anecdotes Zustand

Ejercicios 6.3-6.19 hechos con Zustand en vez de Redux/Redux Toolkit.

Cambios:

- `src/stores/anecdoteStore.js`: store unico con anecdotes, filter, notification y acciones async.
- `src/services/anecdotes.js`: llamadas `fetch` para GET, POST y PUT contra JSON Server.
- `src/components/AnecdoteForm.jsx`: crea nuevas anecdotas con formulario no controlado.
- `src/components/AnecdoteList.jsx`: lista, filtra, ordena por votos desde el store y vota.
- `src/components/Filter.jsx`: guarda el filtro en Zustand.
- `src/components/Notification.jsx`: muestra avisos temporales.
- `db.json`: datos iniciales para `json-server`.

Uso:

```sh
npm run server
npm run dev
```
