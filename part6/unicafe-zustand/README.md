# Unicafe Zustand

Ejercicios 6.1-6.2 hechos con Zustand en vez de Redux.

Cambios:

- `src/stores/feedbackStore.js`: guarda `good`, `ok` y `bad` en un store de Zustand.
- `reduceFeedback`: helper puro para probar la misma logica que se probaria en un reducer.
- `src/tests/feedbackStore.test.js`: comprueba estado inicial, GOOD, OK, BAD y RESET con `deep-freeze`.
- `src/App.jsx`: UI minima con botones y contadores.
