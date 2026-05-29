// CompetitionSelect — pantalla intermedia entre la portada y la lista de
// partidos. Muestra las competiciones de COMPETICIONES como tarjetas grandes.
// Solo las marcadas como `activa: true` son seleccionables; el resto se
// muestran atenuadas con un badge "Próximamente".
//
// Estilos encapsulados en el <style> de abajo (clases .comp-*) para no tocar
// index.css. Reutiliza las variables de tema.

import { COMPETICIONES } from './data.js';

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
          {ligas.map((c) => (
            <button
              key={c.id}
              className={'comp-card' + (c.activa ? '' : ' is-soon')}
              style={{ '--accent': c.color }}
              disabled={!c.activa}
              onClick={() => c.activa && onSelect(c.id)}
              aria-label={c.nombre + (c.activa ? '' : ' (próximamente)')}
            >
              <div className="comp-icon">{c.icono}</div>
              <div className="comp-info">
                <div className="comp-name">{c.nombre}</div>
                <div className="comp-div">{c.division}</div>
              </div>
              {c.activa ? (
                <span className="comp-arrow">›</span>
              ) : (
                <span className="comp-badge">Próximamente</span>
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

.comp-card {
  display: flex; align-items: center; gap: 16px;
  width: 100%; text-align: left;
  background: var(--bg-card, #141a16);
  border: 1px solid var(--line, #2a352e);
  border-left: 4px solid var(--accent);
  border-radius: 16px;
  padding: 20px 18px;
  color: var(--text, #f2f5f3);
  font-family: 'Archivo', sans-serif;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.5);
  transition: transform 0.1s ease, border-color 0.15s ease, background 0.15s ease;
}
.comp-card:active:not(:disabled) {
  transform: scale(0.985);
  background: var(--bg-card-2, #1c2620);
  border-color: var(--accent);
}
.comp-card.is-soon { opacity: 0.5; cursor: not-allowed; }

.comp-icon {
  width: 52px; height: 52px; flex-shrink: 0;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
  background: color-mix(in srgb, var(--accent) 16%, transparent);
}
.comp-info { flex: 1; min-width: 0; }
.comp-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
.comp-div { font-size: 13px; color: var(--text-dim, #8b9690); margin-top: 3px; }

.comp-arrow { font-size: 22px; font-weight: 700; color: var(--accent); padding-right: 4px; }
.comp-badge {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  padding: 5px 9px; border-radius: 8px;
  white-space: nowrap;
}
`;
