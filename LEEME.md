# QUINI-BRO — Prototipo PWA

App de porras de resultado exacto de LaLiga. Un jugador real contra bots, para validar la mecánica antes de invertir en backend y licencias.

## Reglas implementadas
- Jornada 38 real de LaLiga 2025/26 (10 partidos).
- Tres mesas por partido: 2 / 5 / 10 fichas.
- Grupos abierto (random) o cerrado (confianza), 5 a 20 jugadores.
- Resultado exacto. Cada marcador lo pueden coger máx. 2 personas.
- Si ganan 2 con el mismo marcador → reparto 50/50.
- Si nadie acierta → el bote se acumula a la jornada siguiente.
- Con bote: entras pagando media entrada.
- Tras un bote fallido: opción de seguir (media entrada) o retirarte (recuperas la mitad).
- Saldo, bote, jornada e historial se guardan en el navegador (localStorage).
- Instalable como app en el móvil (PWA).

## Empezar (100 fichas de inicio)

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # genera dist/ para producción
npm run preview  # prueba el build
```

## Subir a Vercel
1. Sube esta carpeta a un repo de GitHub.
2. En Vercel: New Project → importa el repo.
3. Framework: Vite. Build: `npm run build`. Output: `dist`.
4. Deploy. Ya tendrás la URL para instalar en el móvil.

## Estructura
- `src/data.js` — partidos reales y constantes (cambia aquí la jornada).
- `src/logic.js` — toda la lógica de negocio (bots, reparto, bote). Reutilizable para backend.
- `src/usePersistentState.js` — persistencia en localStorage.
- `src/App.jsx` — interfaz y navegación.

## Limitaciones del prototipo
- Los rivales son bots; no es multijugador real.
- Las fichas son virtuales, sin valor. Para dinero real harían falta backend (Supabase) y licencia DGOJ o acuerdo con operador.
- Los resultados de partido son simulados (ponderados de forma realista), no reales.
