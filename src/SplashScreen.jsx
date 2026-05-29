// SplashScreen — portada de bienvenida de "QUINIELA BRO".
// Capa puramente visual: se muestra una vez por sesión (ver App.jsx) y al
// pulsar ¡JUGAR! desaparece. No contiene lógica de juego.
//
// Estilos encapsulados en el <style> de abajo (clases prefijadas .splash-*)
// para no tocar index.css. Reutiliza las variables de tema (--green, --gold...).

// --- Eslogan: hay 3 opciones, deja una activa y comenta las demás ---
// const ESLOGAN = 'Clava el resultado, llévate el bote 🏆';   // opción A
// const ESLOGAN = 'Tú pones el ojo, nosotros el bote 👀💰';   // opción B
const ESLOGAN = 'El que la clava, se la lleva ⚽🔥';            // opción C (activa)

// Balones flotando de fondo: posición, tamaño, duración y desfase de cada uno.
const BALONES = [
  { left: '8%',  top: '14%', size: 34, dur: 7,  delay: 0,   drift: 18 },
  { left: '78%', top: '20%', size: 46, dur: 9,  delay: 1.2, drift: 26 },
  { left: '18%', top: '72%', size: 40, dur: 8,  delay: 0.6, drift: 22 },
  { left: '82%', top: '74%', size: 30, dur: 6.5, delay: 2,  drift: 16 },
];

export default function SplashScreen({ onPlay }) {
  return (
    <div className="splash-root">
      <style>{splashCss}</style>

      {/* Balones flotando de fondo (único efecto animado) */}
      <div className="splash-balls" aria-hidden="true">
        {BALONES.map((b, i) => (
          <span
            key={i}
            className="splash-ball"
            style={{
              left: b.left,
              top: b.top,
              fontSize: b.size,
              '--dur': `${b.dur}s`,
              '--delay': `${b.delay}s`,
              '--drift': `${b.drift}px`,
            }}
          >
            ⚽
          </span>
        ))}
      </div>

      {/* Contenido */}
      <div className="splash-content">
        <h1 className="splash-title">
          <span className="splash-line">QUINIELA</span>
          <span className="splash-line splash-bro">BRO</span>
        </h1>

        <p className="splash-slogan">{ESLOGAN}</p>

        <button className="splash-play" onClick={onPlay}>
          ¡JUGAR!
        </button>
      </div>
    </div>
  );
}

const splashCss = `
.splash-root {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(120% 80% at 50% 38%, rgba(22,194,100,0.18), transparent 60%),
    var(--bg, #0a0e0c);
  overflow: hidden;
  padding: max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom));
  animation: splash-fade 0.4s ease;
}
@keyframes splash-fade { from { opacity: 0; } to { opacity: 1; } }

/* --- Balones flotando --- */
.splash-balls { position: absolute; inset: 0; pointer-events: none; }
.splash-ball {
  position: absolute;
  opacity: 0.16;
  filter: grayscale(0.2);
  animation: splash-float var(--dur) ease-in-out var(--delay) infinite;
  will-change: transform;
}
@keyframes splash-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(calc(var(--drift) * -1)) rotate(180deg); }
}

/* --- Contenido --- */
.splash-content {
  position: relative; z-index: 1;
  width: 100%; max-width: 480px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.splash-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.9;
  margin: 0;
  display: flex; flex-direction: column; align-items: center;
}
.splash-line { display: block; }
.splash-title .splash-line:first-child {
  font-size: clamp(46px, 16vw, 84px);
  color: var(--text, #f2f5f3);
}
/* "BRO" — acento dorado (#f5c542). Para volver a verde: color: var(--green) y
   text-shadow con rgba(22,194,100,...) */
.splash-bro {
  font-size: clamp(64px, 23vw, 124px);
  color: var(--gold, #f5c542);
  transform: rotate(-3deg);
  text-shadow: 0 6px 28px rgba(245,197,66,0.32);
  margin-top: -0.06em;
}

.splash-slogan {
  margin: 22px 0 38px;
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: clamp(15px, 4.6vw, 19px);
  color: var(--text-dim, #8b9690);
  letter-spacing: 0.01em;
  max-width: 340px;
}

.splash-play {
  width: 100%; max-width: 320px;
  padding: 18px 24px;
  border: none; border-radius: 16px;
  background: var(--green, #16c264);
  color: #04150b;
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: clamp(18px, 5.4vw, 22px);
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(22,194,100,0.35);
  animation: splash-pulse 2.4s ease-in-out infinite;
  transition: transform 0.1s ease, background 0.15s ease;
}
.splash-play:active {
  transform: scale(0.97);
  background: #13ad58;
  animation: none;
}
@keyframes splash-pulse {
  0%, 100% { box-shadow: 0 10px 30px rgba(22,194,100,0.30); }
  50%      { box-shadow: 0 12px 40px rgba(22,194,100,0.55); }
}

/* Respeta la preferencia de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  .splash-ball, .splash-play { animation: none; }
}
`;
