// Submenú de submodos (Calentada / El Trono). Reutilizable: por defecto muestra
// los submodos de BROS, pero acepta `kicker` y `opciones` para EL BARRO u otros.
// Una opción con `disabled: true` se muestra atenuada con badge "Próximamente".
// Una opción con `badge` (string) muestra una etiqueta de info (p. ej. precio).
const OPCIONES_BROS = [
  { id: 'calentada', icono: '⚡', titulo: 'Calentada', desc: 'Un partido con la peña. Quien acierta, ríe.', color: '#ff6b3d' },
  { id: 'heroe', icono: '🦸', titulo: 'El Trono', desc: '5 jornadas. 1 trono. ¿Eres el rey?', color: '#f5c542', badge: '20 fichas' },
];

export default function PorraCalienteSelect({ onPick, onBack, kicker = '🔥 BROS', titulo = 'Elige submodo', opciones = OPCIONES_BROS }) {
  return (
    <div className="pcs-root">
      <style>{pcsCss}</style>
      <div className="pcs-content">
        <div className="pcs-head">
          <button className="pcs-back" onClick={onBack} aria-label="Volver">‹</button>
          <div>
            <div className="pcs-kicker">{kicker}</div>
            <h1 className="pcs-title">{titulo}</h1>
          </div>
        </div>
        <div className="pcs-list">
          {opciones.map((o, i) => (
            <button
              key={o.id}
              className={'pcs-card' + (o.disabled ? ' is-soon' : '') + (o.id === 'heroe' ? ' pcs-card--gold' : '')}
              data-id={o.id}
              style={{ '--i': i, '--accent': o.color }}
              disabled={o.disabled}
              onClick={() => !o.disabled && onPick(o.id)}
              aria-label={o.titulo + (o.disabled ? ' (próximamente)' : '')}
            >
              <div className="pcs-icon">{o.icono}</div>
              <div className="pcs-info">
                <div className="pcs-name">{o.titulo}</div>
                <div className="pcs-desc">{o.desc}</div>
                {o.badge && !o.disabled && <span className="pcs-chip">{o.badge}</span>}
              </div>
              {o.disabled ? <span className="pcs-badge">🔒 Próximamente</span> : <span className="pcs-arrow">›</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const pcsCss = `
.pcs-root {
  position: fixed; inset: 0; z-index: 85;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(120% 70% at 50% 25%, rgba(245,197,66,0.08), transparent 55%), var(--bg, #0a0e0c);
  padding: max(24px, env(safe-area-inset-top)) 22px max(24px, env(safe-area-inset-bottom));
  animation: pcs-fade 0.3s ease;
}
@keyframes pcs-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.pcs-content { width: 100%; max-width: 480px; }
.pcs-head { display: flex; align-items: center; gap: 12px; margin-bottom: 26px; }
.pcs-back { width: 40px; height: 40px; flex-shrink: 0; border-radius: 11px; background: var(--bg-card,#141a16); border: 1px solid var(--line,#2a352e); color: var(--text,#f2f5f3); font-size: 20px; cursor: pointer; }
.pcs-kicker { font-family: 'Archivo Narrow', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-faint,#5a655e); }
.pcs-title { font-family: 'Archivo', sans-serif; font-weight: 900; letter-spacing: -0.03em; font-size: clamp(24px, 7vw, 34px); color: var(--text,#f2f5f3); margin-top: 3px; }
.pcs-list { display: flex; flex-direction: column; gap: 14px; }

/* --- Entrada en cascada (misma duración/easing que el resto de selecciones) --- */
@keyframes pcs-card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pcs-card {
  position: relative;
  display: flex; align-items: center; gap: 16px; width: 100%; text-align: left;
  background-color: var(--bg-card,#141a16);
  background-image: radial-gradient(130% 140% at 0% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 58%);
  border: 1px solid var(--line,#2a352e); border-left: 4px solid var(--accent); border-radius: 16px;
  padding: 20px 18px; color: var(--text,#f2f5f3); font-family: 'Archivo', sans-serif; cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  animation: pcs-card-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 70ms);
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease;
}
.pcs-card.is-soon { opacity: 0.55; cursor: not-allowed; background-image: none; }

.pcs-icon { width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; background: color-mix(in srgb, var(--accent) 16%, transparent); transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1); }
.pcs-info { flex: 1; min-width: 0; }
.pcs-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
.pcs-desc { font-size: 13px; color: var(--text-dim,#8b9690); margin-top: 3px; }
.pcs-arrow { font-size: 22px; font-weight: 700; color: var(--accent); padding-right: 4px; }

/* Etiqueta de info (precio de entrada). Visible junto al copy con gancho. */
.pcs-chip {
  display: inline-block; margin-top: 8px;
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  padding: 3px 9px; border-radius: 7px;
}

/* Badge "Próximamente" sólido y con candado: se lee bloqueada al primer vistazo. */
.pcs-badge {
  font-family: 'Archivo Narrow', sans-serif;
  font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
  color: #11160f; background: #d8a72e; border: 1px solid #e8bd4a;
  padding: 6px 10px; border-radius: 9px; white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.35);
}

/* --- Feedback: hover (desktop) eleva; active (tap) hunde --- */
@media (hover: hover) {
  .pcs-card:not(:disabled):hover { transform: translateY(-3px); border-color: var(--accent); box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
  .pcs-card:not(:disabled):hover .pcs-icon { transform: scale(1.05); }
  /* El Trono = modo prestigio: leve brillo dorado en el borde (igual que Champions). */
  .pcs-card.pcs-card--gold:not(:disabled):hover {
    border-color: rgba(245,197,66,0.65);
    box-shadow: 0 12px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,66,0.5), 0 0 22px rgba(245,197,66,0.22);
  }
}
.pcs-card:active:not(:disabled) { transform: scale(0.98); border-color: var(--accent); }

/* --- Accesibilidad: respeta prefers-reduced-motion --- */
@media (prefers-reduced-motion: reduce) {
  .pcs-root { animation: none; }
  .pcs-card { animation: none; transition: border-color 120ms ease, box-shadow 120ms ease; }
  .pcs-icon { transition: none; }
  .pcs-card:hover, .pcs-card:active:not(:disabled) { transform: none; }
  .pcs-card:hover .pcs-icon { transform: none; }
}
`;
