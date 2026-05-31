// Selección de modalidad tras elegir competición: EL BARRO (vs random) vs BROS
// (entre amigos). Cada tarjeta tiene su propia personalidad visual: EL BARRO es
// terroso y crudo; BROS es verde QUINI-BRO, limpio y premium.
// Estilos encapsulados (clases .mod-*), patrón coherente con CompetitionSelect.
export default function ModalidadSelect({ compObj, onSelect, onBack }) {
  const m = compObj?.modalidades || { normal: true, calentada: true, heroe: true };
  const todas = [
    { id: 'normal', icono: '🎲', titulo: 'EL BARRO', desc: 'Tírate al barro contra cualquiera.', color: '#8b4513' },
    { id: 'caliente', icono: '🔥', titulo: 'BROS', desc: 'Pícate con tus colegas.', color: '#16c264' },
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
          {opciones.map((o, i) => (
            <button key={o.id} className="mod-card" data-id={o.id} style={{ '--i': i, '--accent': o.color }} onClick={() => onSelect(o.id)}>
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

/* --- Entrada en cascada (misma duración/easing que el resto de selecciones) --- */
@keyframes mod-card-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.mod-card {
  position: relative;
  display: flex; align-items: center; gap: 16px; width: 100%; text-align: left;
  background-color: var(--bg-card,#141a16);
  background-image: radial-gradient(130% 140% at 0% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 58%);
  border: 1px solid var(--line,#2a352e); border-left: 4px solid var(--accent); border-radius: 16px;
  padding: 20px 18px; color: var(--text,#f2f5f3); font-family: 'Archivo', sans-serif; cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  animation: mod-card-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i, 0) * 70ms);
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease;
}
.mod-icon { width: 52px; height: 52px; flex-shrink: 0; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; background: color-mix(in srgb, var(--accent) 16%, transparent); transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1); }
.mod-info { flex: 1; min-width: 0; }
.mod-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
.mod-desc { font-size: 13px; color: var(--text-dim,#8b9690); margin-top: 3px; }
.mod-arrow { font-size: 22px; font-weight: 700; color: var(--accent); padding-right: 4px; }

/* Personalidad tipográfica: EL BARRO más crudo (mayúsculas, tracking abierto);
   BROS más amistoso (tracking ajustado). */
.mod-card[data-id="normal"] .mod-name { text-transform: uppercase; letter-spacing: 0.05em; font-weight: 900; }
.mod-card[data-id="caliente"] .mod-name { letter-spacing: -0.01em; }

/* --- Feedback: hover (desktop) eleva; active (tap) hunde --- */
@media (hover: hover) {
  .mod-card:hover { transform: translateY(-3px); border-color: var(--accent); box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
  .mod-card:hover .mod-icon { transform: scale(1.05); }
}
.mod-card:active { transform: scale(0.98); border-color: var(--accent); }

/* --- Accesibilidad: respeta prefers-reduced-motion --- */
@media (prefers-reduced-motion: reduce) {
  .mod-root { animation: none; }
  .mod-card { animation: none; transition: border-color 120ms ease, box-shadow 120ms ease; }
  .mod-icon { transition: none; }
  .mod-card:hover, .mod-card:active { transform: none; }
  .mod-card:hover .mod-icon { transform: none; }
}
`;
