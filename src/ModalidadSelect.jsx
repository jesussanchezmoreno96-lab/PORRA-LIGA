// Selección de modalidad tras elegir competición: Porra Normal vs Porra Caliente.
// Estilos encapsulados (clases .mod-*), patrón coherente con CompetitionSelect.
export default function ModalidadSelect({ compObj, onSelect, onBack }) {
  const m = compObj?.modalidades || { normal: true, calentada: true, heroe: true };
  const todas = [
    { id: 'normal', icono: '🎲', titulo: 'Porra Normal', desc: 'Juega contra gente aleatoria por el bote.', color: '#16c264' },
    { id: 'caliente', icono: '🔥', titulo: 'Porra Caliente', desc: 'Entre amigos: Calentada o Modo Héroe.', color: '#f5c542' },
  ];
  // Solo se muestran las modalidades que soporta la competición.
  const opciones = todas.filter((o) => (o.id === 'normal' ? m.normal : (m.calentada || m.heroe)));
  return (
    <div className="mod-root">
      <style>{modCss}</style>
      <div className="mod-content">
        <div className="mod-head">
          <button className="mod-back" onClick={onBack} aria-label="Volver">‹</button>
          <div>
            <div className="mod-kicker">{compObj?.nombre || 'Competición'}</div>
            <h1 className="mod-title">Elige modalidad</h1>
          </div>
        </div>
        <div className="mod-list">
          {opciones.map((o) => (
            <button key={o.id} className="mod-card" style={{ '--accent': o.color }} onClick={() => onSelect(o.id)}>
              <div className="mod-icon">{o.icono}</div>
              <div className="mod-info">
                <div className="mod-name">{o.titulo}</div>
                <div className="mod-desc">{o.desc}</div>
              </div>
              <span className="mod-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const modCss = `
.mod-root {
  position: fixed; inset: 0; z-index: 85;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(120% 70% at 50% 25%, rgba(22,194,100,0.08), transparent 55%), var(--bg, #0a0e0c);
  padding: max(24px, env(safe-area-inset-top)) 22px max(24px, env(safe-area-inset-bottom));
  animation: mod-fade 0.3s ease;
}
@keyframes mod-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.mod-content { width: 100%; max-width: 480px; }
.mod-head { display: flex; align-items: center; gap: 12px; margin-bottom: 26px; }
.mod-back { width: 40px; height: 40px; flex-shrink: 0; border-radius: 11px; background: var(--bg-card,#141a16); border: 1px solid var(--line,#2a352e); color: var(--text,#f2f5f3); font-size: 20px; cursor: pointer; }
.mod-kicker { font-family: 'Archivo Narrow', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-faint,#5a655e); }
.mod-title { font-family: 'Archivo', sans-serif; font-weight: 900; letter-spacing: -0.03em; font-size: clamp(24px, 7vw, 34px); color: var(--text,#f2f5f3); margin-top: 3px; }
.mod-list { display: flex; flex-direction: column; gap: 14px; }
.mod-card { display: flex; align-items: center; gap: 16px; width: 100%; text-align: left; background: var(--bg-card,#141a16); border: 1px solid var(--line,#2a352e); border-left: 4px solid var(--accent); border-radius: 16px; padding: 20px 18px; color: var(--text,#f2f5f3); font-family: 'Archivo', sans-serif; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.4); transition: transform 0.1s ease, border-color 0.15s ease, background 0.15s ease; }
.mod-card:active { transform: scale(0.985); background: var(--bg-card-2,#1c2620); border-color: var(--accent); }
.mod-icon { width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; background: color-mix(in srgb, var(--accent) 16%, transparent); }
.mod-info { flex: 1; min-width: 0; }
.mod-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
.mod-desc { font-size: 13px; color: var(--text-dim,#8b9690); margin-top: 3px; }
.mod-arrow { font-size: 22px; font-weight: 700; color: var(--accent); padding-right: 4px; }
`;
