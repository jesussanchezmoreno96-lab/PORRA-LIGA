// Submenú de submodos (Calentada / El Trono). Reutilizable: por defecto muestra
// los submodos de BROS, pero acepta `kicker` y `opciones` para EL BARRO u otros.
// Una opción con `disabled: true` se muestra atenuada con badge "Próximamente".
const OPCIONES_BROS = [
  { id: 'calentada', icono: '⚡', titulo: 'Calentada', desc: 'Un partido suelto en grupo cerrado con código.', color: '#16c264' },
  { id: 'heroe', icono: '🦸', titulo: 'El Trono', desc: 'Liguilla de 5 jornadas. Entrada 20 fichas.', color: '#f5c542' },
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
          {opciones.map((o) => (
            <button
              key={o.id}
              className={'pcs-card' + (o.disabled ? ' is-soon' : '')}
              style={{ '--accent': o.color }}
              disabled={o.disabled}
              onClick={() => !o.disabled && onPick(o.id)}
              aria-label={o.titulo + (o.disabled ? ' (próximamente)' : '')}
            >
              <div className="pcs-icon">{o.icono}</div>
              <div className="pcs-info">
                <div className="pcs-name">{o.titulo}</div>
                <div className="pcs-desc">{o.desc}</div>
              </div>
              {o.disabled ? <span className="pcs-badge">Próximamente</span> : <span className="pcs-arrow">›</span>}
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
.pcs-card { display: flex; align-items: center; gap: 16px; width: 100%; text-align: left; background: var(--bg-card,#141a16); border: 1px solid var(--line,#2a352e); border-left: 4px solid var(--accent); border-radius: 16px; padding: 20px 18px; color: var(--text,#f2f5f3); font-family: 'Archivo', sans-serif; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.4); transition: transform 0.1s ease, border-color 0.15s ease, background 0.15s ease; }
.pcs-card:active:not(:disabled) { transform: scale(0.985); background: var(--bg-card-2,#1c2620); border-color: var(--accent); }
.pcs-card.is-soon { opacity: 0.5; cursor: not-allowed; }
.pcs-badge { font-family: 'Archivo Narrow', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent); background: color-mix(in srgb, var(--accent) 14%, transparent); padding: 5px 9px; border-radius: 8px; white-space: nowrap; }
.pcs-icon { width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; background: color-mix(in srgb, var(--accent) 16%, transparent); }
.pcs-info { flex: 1; min-width: 0; }
.pcs-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
.pcs-desc { font-size: 13px; color: var(--text-dim,#8b9690); margin-top: 3px; }
.pcs-arrow { font-size: 22px; font-weight: 700; color: var(--accent); padding-right: 4px; }
`;
