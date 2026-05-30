// Pantalla de creación del Modo Héroe: resumen de reglas + inscripción (20 fichas).
import { HEROE_ENTRADA, HEROE_MAX_JUGADORES } from './heroe.js';
import { wrap, btnPrimary } from './heroeStyles.js';
import { Header, Aviso } from './heroeUI.jsx';

const card = { background: 'var(--bg-card)', border: '1px solid var(--line-soft)', borderRadius: 14, padding: 16 };
const bb = { color: 'var(--text)' };

export default function HeroeCreate({ compObj, saldo, onCrear, onBack }) {
  const h = compObj.heroe;
  const totalPartidos = h.jornadas * h.partidosPorJornada;
  const descFormato = h.dias
    ? `1 semana · ${totalPartidos} partidos (${h.partidosPorJornada} ${h.etiquetas[0]} + ${h.partidosPorJornada} ${h.etiquetas[1]})`
    : `${h.jornadas} jornadas · ${h.partidosPorJornada} partidos por jornada`;
  const puede = saldo >= HEROE_ENTRADA;
  const hayPartidos = h.dias
    ? h.dias.every((d) => (compObj.partidos || []).filter((p) => p.dia === d).length >= h.partidosPorJornada)
    : (compObj.partidos?.length || 0) >= h.partidosPorJornada;
  return (
    <div style={wrap}>
      <Header titulo="Crear El Trono" sub={compObj.nombre} onBack={onBack} />
      <div style={{ ...card, lineHeight: 1.5, fontSize: 13.5, color: 'var(--text-dim)' }}>
        <div style={{ color: 'var(--text)', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>🦸 Liguilla competitiva</div>
        • Grupo cerrado, hasta <b style={bb}>{HEROE_MAX_JUGADORES} jugadores</b>.<br />
        • <b style={bb}>{descFormato}</b>.<br />
        • Puntos: <b style={bb}>3</b> resultado exacto · <b style={bb}>1</b> 1X2 · <b style={bb}>+1</b> al más cercano.<br />
        • Reparto final: 60/30/10 al podio (comisión casa 10%).
      </div>
      <div style={{ ...card, marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Entrada obligatoria</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--gold)' }}>{HEROE_ENTRADA} fichas</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-dim)' }}>Tu saldo<br /><b style={{ color: 'var(--text)', fontSize: 16 }}>{saldo}</b></div>
      </div>
      {!hayPartidos && <Aviso txt="Esta competición no tiene partidos suficientes para El Trono." />}
      {hayPartidos && !puede && <Aviso txt={`Necesitas ${HEROE_ENTRADA} fichas para inscribirte.`} />}
      <button
        onClick={onCrear}
        disabled={!puede || !hayPartidos}
        style={{ ...btnPrimary, marginTop: 16, opacity: (!puede || !hayPartidos) ? 0.4 : 1 }}
      >
        Crear grupo y pagar {HEROE_ENTRADA}
      </button>
    </div>
  );
}

