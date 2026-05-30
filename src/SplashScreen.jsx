// SplashScreen — portada de bienvenida de "QUINI-BRO".
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

// Geometría del balón Telstar (dibujado, NO emoji): pentágono central + 5
// pentágonos en el borde (recortados por el círculo) + 5 costuras radiales.
// Simetría de 5 → gira limpio. Calculado una vez al cargar el módulo.
const BALL = (() => {
  const C = 50, D = 40, rC = 14, rO = 11;
  const pent = (cx, cy, rho, startDeg) =>
    Array.from({ length: 5 }, (_, m) => {
      const a = ((startDeg + m * 72) * Math.PI) / 180;
      return `${(cx + rho * Math.cos(a)).toFixed(2)},${(cy + rho * Math.sin(a)).toFixed(2)}`;
    }).join(' ');
  const central = pent(C, C, rC, -90);
  const outers = []; const seams = [];
  for (let k = 0; k < 5; k++) {
    const th = -90 + k * 72; const rad = (th * Math.PI) / 180;
    const ox = C + D * Math.cos(rad); const oy = C + D * Math.sin(rad);
    outers.push(pent(ox, oy, rO, th + 180)); // un vértice apunta al centro
    const cvx = C + rC * Math.cos(rad); const cvy = C + rC * Math.sin(rad);
    const ir = ((th + 180) * Math.PI) / 180;
    seams.push([cvx, cvy, ox + rO * Math.cos(ir), oy + rO * Math.sin(ir)]);
  }
  return { central, outers, seams };
})();

function BallSVG() {
  return (
    <svg className="qb-ball" viewBox="0 0 100 100" aria-hidden="true">
      <defs><clipPath id="qb-ballclip"><circle cx="50" cy="50" r="48" /></clipPath></defs>
      <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#0a0e0c" strokeWidth="2.5" />
      <g clipPath="url(#qb-ballclip)" fill="#0a0e0c" stroke="#0a0e0c" strokeWidth="0.6" strokeLinejoin="round">
        <polygon points={BALL.central} />
        {BALL.outers.map((p, i) => <polygon key={i} points={p} />)}
      </g>
      <g clipPath="url(#qb-ballclip)" stroke="#0a0e0c" strokeWidth="2.5" strokeLinecap="round">
        {BALL.seams.map((s, i) => <line key={i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />)}
      </g>
    </svg>
  );
}

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
        <h1 className="splash-logo" aria-label="QUINI-BRO">
          <span className="qb-quini">QUINI</span>
          <span className="qb-dash" aria-hidden="true">–</span>
          <span className="qb-bro">BR<BallSVG /></span>
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
/* --- Logo "QUINI-BRO": composición asimétrica en dos líneas --- */
/* QUINI (blanco, izquierda, -2°) · guion dorado diagonal flotando ·
   BRO (verde, derecha, +3°, ~20% más grande, con solape sutil). */
.splash-logo {
  position: relative;
  width: 100%;
  max-width: 340px;
  margin: 0 auto 6px;
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.82;
  display: flex; flex-direction: column;
}
.qb-quini {
  align-self: flex-start;
  margin-left: 4%;
  position: relative; z-index: 2;
  font-size: clamp(52px, 17vw, 96px);
  color: var(--text, #f2f5f3);
  transform: rotate(-2deg);
}
.qb-bro {
  align-self: flex-end;
  margin-right: 3%;
  margin-top: -0.14em;       /* solape sutil con QUINI */
  position: relative; z-index: 2;
  font-size: clamp(64px, 21vw, 116px); /* ~20% mayor que QUINI */
  color: var(--green, #16c264);
  transform: rotate(3deg);
  text-shadow: 0 6px 26px rgba(22,194,100,0.28);
}
/* Balón Telstar como "O" de BRO: tamaño de letra, en línea base, girando lento.
   Solo gira el balón (su transform se compone con el +3° de la palabra). */
.qb-ball {
  display: inline-block;
  width: 0.82em; height: 0.82em;
  vertical-align: -0.06em;
  margin-left: -0.01em;
  transform-origin: 50% 50%;
  animation: qb-spin 9s linear infinite;
}
@keyframes qb-spin { to { transform: rotate(360deg); } }

/* Guion como elemento gráfico: dorado, grande, diagonal, flotando en el hueco */
.qb-dash {
  position: absolute; z-index: 3;
  left: 49%; top: 47%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: clamp(58px, 18vw, 104px);
  color: var(--gold, #f5c542);
  text-shadow: 0 4px 22px rgba(245,197,66,0.45);
  line-height: 1; pointer-events: none;
}

.splash-slogan {
  margin: 26px 0 38px;
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
  .splash-ball, .splash-play, .qb-ball { animation: none; }
}
`;
