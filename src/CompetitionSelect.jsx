// CompetitionSelect — pantalla intermedia entre la portada y la lista de
// partidos. Muestra las competiciones de COMPETICIONES como tarjetas grandes.
// Solo las marcadas como `activa: true` son seleccionables; el resto se
// muestran atenuadas con un badge "Próximamente".
//
// Estilos encapsulados en el <style> de abajo (clases .comp-*) para no tocar
// index.css. Reutiliza las variables de tema.

import { COMPETICIONES } from './data.js';

// Microcopia de cabecera por competición: se muestra DEBAJO de la división
// factual, para darle personalidad sin perder el dato.
const TAGLINES = {
  laliga: 'La élite del fútbol español',
  hypermotion: 'Sangre, fútbol y ascensos',
  champions: 'Donde se hace historia',
};

export default function CompetitionSelect({ onSelect }) {
  const ligas = Object.values(COMPETICIONES);

  return (
    <div className="comp-root">
      <style>{compCss}</style>

      <div className="comp-content">
        <div className="comp-head">
          <div className="comp-kicker">Porra</div>
          <h1 className="comp-title">Elige competición</h1>
        </div>

        <div className="comp-list">
          {ligas.map((c, i) => (
            <button
              key={c.id}
              className={'comp-card' + (c.activa ? ' is-live' : ' is-soon') + (c.cardBg ? ' has-photo' : '')}
              style={{
                // Índice para el stagger de entrada en cascada.
                '--i': i,
                // Las bloqueadas adoptan un gris apagado en vez de su color.
                '--accent': c.activa ? c.color : '#6b7280',
                // Fondo atmosférico opcional por competición (Champions), con
                // overlay oscuro para mantener legible el texto del card.
                ...(c.cardBg ? {
                  backgroundImage: `linear-gradient(90deg, rgba(16,20,18,0.93), rgba(16,20,18,0.62)), url('${c.cardBg}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {}),
              }}
              disabled={!c.activa}
              onClick={() => c.activa && onSelect(c.id)}
              aria-label={c.nombre + (c.activa ? '' : ' (próximamente)')}
            >
              <div className="comp-icon">{c.icono}</div>
              <div className="comp-info">
                <div className="comp-name">{c.nombre}</div>
                <div className="comp-div">{c.division}</div>
                {TAGLINES[c.id] && <div className="comp-tag">{TAGLINES[c.id]}</div>}
              </div>
              {c.activa ? (
                <span className="comp-arrow">›</span>
              ) : (
                <span className="comp-badge">🔒 Próximamente</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const compCss = `
/* Fondo atmosférico de trofeo (Unsplash, licencia libre). El propio .comp-root
   es position:fixed, así la foto queda fija (efecto cinemático). Overlay oscuro
   fuerte encima para que las tarjetas sigan legibles. */
.comp-root {
  position: fixed; inset: 0; z-index: 90;
  display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(120% 70% at 50% 25%, rgba(22,194,100,0.08), transparent 55%),
    linear-gradient(180deg, rgba(10,14,12,0.86), rgba(10,14,12,0.80) 45%, rgba(10,14,12,0.92)),
    url('https://images.unsplash.com/photo-1514820720301-4c4790309f46?w=1200&q=70&auto=format&fit=crop') center / cover no-repeat,
    var(--bg, #0a0e0c);
  padding: max(24px, env(safe-area-inset-top)) 22px max(24px, env(safe-area-inset-bottom));
  animation: comp-fade 0.3s ease;
}
@keyframes comp-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.comp-content { width: 100%; max-width: 480px; }

.comp-head { text-align: center; margin-bottom: 26px; }
.comp-kicker {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-faint, #5a655e);
}
.comp-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 900; letter-spacing: -0.03em;
  font-size: clamp(26px, 8vw, 36px);
  color: var(--text, #f2f5f3);
  margin-top: 4px;
}

.comp-list { display: flex; flex-direction: column; gap: 14px; }

/* --- Entrada en cascada (fade + slide desde abajo, acelerado por GPU) --- */
@keyframes comp-card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.comp-card {
  position: relative;
  display: flex; align-items: center; gap: 16px;
  width: 100%; text-align: left;
  background-color: var(--bg-card, #141a16);
  border: 1px solid var(--line, #2a352e);
  border-left: 4px solid var(--accent);
  border-radius: 16px;
  padding: 20px 18px;
  color: var(--text, #f2f5f3);
  font-family: 'Archivo', sans-serif;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.5);
  animation: comp-card-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 70ms);
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease;
}
/* Tinte de acento en reposo para las activas sin foto (LaLiga = verde césped). */
.comp-card.is-live:not(.has-photo) {
  background-image: radial-gradient(130% 140% at 0% 0%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 58%);
}

.comp-icon {
  width: 52px; height: 52px; flex-shrink: 0;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}
.comp-info { flex: 1; min-width: 0; }
.comp-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
.comp-div { font-size: 13px; color: var(--text-dim, #8b9690); margin-top: 3px; }
.comp-tag {
  font-size: 12px; font-style: italic; margin-top: 4px;
  color: color-mix(in srgb, var(--accent) 60%, var(--text-dim, #8b9690));
}

/* --- Feedback: hover (solo desktop) eleva la tarjeta; active (tap) la hunde --- */
@media (hover: hover) {
  .comp-card.is-live:hover {
    transform: translateY(-3px);
    border-color: var(--accent);
    box-shadow: 0 12px 30px rgba(0,0,0,0.55);
  }
  .comp-card.is-live:hover .comp-icon { transform: scale(1.05); }
  /* Champions: leve brillo dorado europeo al pasar el ratón. */
  .comp-card.has-photo.is-live:hover {
    border-color: rgba(245,197,66,0.6);
    box-shadow: 0 12px 30px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,197,66,0.5), 0 0 22px rgba(245,197,66,0.22);
  }
}
.comp-card.is-live:active { transform: scale(0.98); border-color: var(--accent); }
.comp-card.is-soon { opacity: 0.55; cursor: not-allowed; }

.comp-arrow { font-size: 22px; font-weight: 700; color: var(--accent); padding-right: 4px; }
/* Badge "Próximamente" sólido y con candado: se lee bloqueada al primer vistazo. */
.comp-badge {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
  color: #11160f;
  background: #d8a72e;
  border: 1px solid #e8bd4a;
  padding: 6px 10px; border-radius: 9px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.35);
}

/* --- Accesibilidad: respeta prefers-reduced-motion --- */
@media (prefers-reduced-motion: reduce) {
  .comp-root { animation: none; }
  .comp-card { animation: none; transition: border-color 120ms ease, box-shadow 120ms ease; }
  .comp-icon { transition: none; }
  .comp-card.is-live:hover, .comp-card.is-live:active { transform: none; }
  .comp-card.is-live:hover .comp-icon { transform: none; }
}
`;
