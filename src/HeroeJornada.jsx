// Jornada del Modo Héroe. Desbloqueo secuencial (simula "solo la semana del
// partido"): solo se puede pronosticar la jornada actual; las futuras salen
// bloqueadas y las pasadas en modo lectura (resultados reales + puntos).
import { useState } from 'react';
import { puntuarJornada } from './heroe.js';
import { wrap, btnPrimary } from './heroeStyles.js';
import { Header } from './heroeUI.jsx';

export default function HeroeJornada({ grupo, onCerrar, onVerClasif, onExit }) {
  const actual = grupo.jornadaActual;
  const [verJ, setVerJ] = useState(actual);
  // Etiqueta de fase: 'Martes'/'Miércoles' (Champions) o 'J1'… (liga).
  const etiqueta = (j) => (grupo.etiquetas ? grupo.etiquetas[j] : 'J' + (j + 1));
  // Pronósticos locales de la jornada abierta (por defecto 1-1).
  const partidosAbierta = grupo.partidos[actual] || [];
  const [preds, setPreds] = useState(() => partidosAbierta.map(() => ({ l: 1, v: 1 })));

  const estadoJ = (j) => (grupo.cerradas[j] ? 'cerrada' : j === actual ? 'actual' : 'bloqueada');
  const set = (i, campo, d) => setPreds((p) => p.map((x, k) => (k === i ? { ...x, [campo]: Math.max(0, Math.min(9, x[campo] + d)) } : x)));
  const cerrar = () => onCerrar(preds.map((p) => `${p.l}-${p.v}`));

  const verEstado = estadoJ(verJ);
  const partidosVer = grupo.partidos[verJ] || [];

  return (
    <div style={wrap}>
      <Header titulo="Modo Héroe" sub={`Código ${grupo.codigo} · ${grupo.jugadores.length} jugadores`} onBack={onExit} />

      {/* Barra de fases (jornadas o días) */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 16 }}>
        {Array.from({ length: grupo.numJornadas }).map((_, j) => {
          const e = estadoJ(j);
          const sel = j === verJ;
          const clic = e !== 'bloqueada';
          return (
            <button
              key={j}
              disabled={!clic}
              onClick={() => clic && setVerJ(j)}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 10, fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 12, cursor: clic ? 'pointer' : 'default',
                border: '1px solid ' + (sel ? 'var(--green)' : 'var(--line)'),
                background: sel ? 'rgba(22,194,100,0.15)' : 'var(--bg-card)',
                color: e === 'bloqueada' ? 'var(--text-faint)' : sel ? 'var(--green)' : 'var(--text)',
              }}
            >
              {etiqueta(j)}{e === 'cerrada' ? ' ✓' : e === 'bloqueada' ? ' 🔒' : ''}
            </button>
          );
        })}
      </div>

      <button onClick={onVerClasif} style={{ ...btnPrimary, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--line)', marginBottom: 16 }}>
        📊 Ver clasificación
      </button>

      {verEstado === 'actual' && (
        <>
          <div style={lbl}>Pon tu pronóstico · {etiqueta(verJ)}</div>
          {partidosVer.map((p, i) => (
            <div key={i} style={partRow}>
              <span style={teamN}>{p.local}</span>
              <Stepper valor={preds[i]?.l ?? 1} onMenos={() => set(i, 'l', -1)} onMas={() => set(i, 'l', 1)} />
              <span style={{ color: 'var(--text-faint)', fontWeight: 700 }}>–</span>
              <Stepper valor={preds[i]?.v ?? 1} onMenos={() => set(i, 'v', -1)} onMas={() => set(i, 'v', 1)} />
              <span style={{ ...teamN, textAlign: 'right' }}>{p.visit}</span>
            </div>
          ))}
          <button onClick={cerrar} style={{ ...btnPrimary, marginTop: 16 }}>
            Cerrar {etiqueta(verJ)}
          </button>
          <div style={{ fontSize: 11.5, color: 'var(--text-faint)', textAlign: 'center', marginTop: 10 }}>
            Al cerrar se juegan los resultados y se desbloquea la siguiente fase.
          </div>
        </>
      )}

      {verEstado === 'cerrada' && <Resultados grupo={grupo} j={verJ} etiqueta={etiqueta(verJ)} />}

      {verEstado === 'bloqueada' && (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '40px 20px', fontSize: 14 }}>
          🔒 {etiqueta(verJ)} bloqueada.<br />Disponible cuando termine {etiqueta(actual)}.
        </div>
      )}
    </div>
  );
}

function Resultados({ grupo, j, etiqueta }) {
  const jr = puntuarJornada(grupo.jugadores, grupo.reales[j], grupo.pronosticos[j]);
  const partidos = grupo.partidos[j];
  const mio = jr.yo;
  return (
    <>
      <div style={lbl}>Resultados · {etiqueta}</div>
      {partidos.map((p, i) => {
        const d = mio.detalle[i];
        return (
          <div key={i} style={{ ...partRow, justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, flex: 1 }}>{p.local} <b>{grupo.reales[j][i]}</b> {p.visit}</span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>tú {d.pred || '—'}</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: d.puntos > 0 ? 'var(--green)' : 'var(--text-faint)', minWidth: 30, textAlign: 'right' }}>+{d.puntos}</span>
          </div>
        );
      })}
      <div style={{ ...lbl, marginTop: 18 }}>Puntos de la jornada</div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line-soft)', borderRadius: 12, padding: '6px 12px' }}>
        {grupo.jugadores.map((jug) => (
          <div key={jug.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderTop: '1px solid var(--line-soft)', fontSize: 13 }}>
            <span style={{ color: jug.id === 'yo' ? 'var(--green)' : 'var(--text)', fontWeight: jug.id === 'yo' ? 800 : 600 }}>{jug.nombre}</span>
            <b>+{jr[jug.id].puntos}</b>
          </div>
        ))}
      </div>
    </>
  );
}

function Stepper({ valor, onMenos, onMas }) {
  const b = { width: 28, height: 26, borderRadius: 7, background: 'var(--bg-card)', border: '1px solid var(--line)', color: 'var(--text)', fontSize: 15, fontWeight: 700, cursor: 'pointer' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ fontSize: 24, fontWeight: 900, width: 30, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{valor}</div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={onMenos} style={b}>−</button>
        <button onClick={onMas} style={b}>+</button>
      </div>
    </div>
  );
}

const lbl = { fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-dim)', margin: '4px 0 10px' };
const partRow = { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--line-soft)', borderRadius: 12, padding: '12px 14px', marginBottom: 9 };
const teamN = { flex: 1, fontSize: 13, fontWeight: 600, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
