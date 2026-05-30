// Calentada — la ronda en sí. Reutiliza la lógica de porras normales (logic.js),
// pero con grupo cerrado de amigos-bot y bote propio (separado de la Porra Normal).
import { useState } from 'react';
import { contarResultados, resultadoDisponible, simularResultadoReal, resolverPorra, costeEntrada, generarBots } from './logic.js';
import { wrap, btnPrimary } from './heroeStyles.js';
import { Header } from './heroeUI.jsx';

const AMIGOS = ['Carlos (amigo)', 'Marta (amiga)', 'Javi (amigo)', 'Lucía (amiga)', 'Dani (amigo)', 'Sara (amiga)', 'Nacho (amigo)', 'Paula (amiga)', 'Álvaro (amigo)'];

function generarAmigosConRes() {
  const n = 4 + Math.floor(Math.random() * 6); // 4..9
  const bots = generarBots(n);
  return bots.map((b, i) => ({ ...b, nombre: AMIGOS[i % AMIGOS.length] }));
}

export default function CalentadaPorra({ cfg, calBote, saldo, setSaldo, setIngresosApp, setCalBote, onSiguiente, onRetirar, onSalir }) {
  const [amigos] = useState(generarAmigosConRes);
  const [golL, setGolL] = useState(1);
  const [golV, setGolV] = useState(1);
  const [error, setError] = useState('');
  const [res, setRes] = useState(null);

  const hayBote = calBote > 0;
  const coste = costeEntrada(cfg.mesa, hayBote);
  const boteTotal = amigos.length * coste + calBote;
  const cuenta = contarResultados(amigos);

  function confirmar() {
    setError('');
    const marcador = `${golL}-${golV}`;
    if (!resultadoDisponible(amigos, marcador)) { setError('Ese resultado ya lo tienen 2 amigos. Elige otro.'); return; }
    if (saldo < coste) { setError('No tienes fichas suficientes.'); return; }
    const jugadoresFull = [...amigos, { nombre: 'Tú', res: marcador, bot: false }];
    const real = simularResultadoReal();
    const r = resolverPorra({ jugadores: jugadoresFull, boteTotal, resultadoReal: real });
    const gane = r.hayGanador && r.ganadores.some((g) => g.nombre === 'Tú');
    let ns = saldo - coste;
    if (gane) ns += r.premioPorGanador;
    setSaldo(ns);
    if (r.hayGanador && r.comisionApp > 0) setIngresosApp((a) => a + r.comisionApp);
    setCalBote(gane ? 0 : r.boteAcumulado);
    setRes({ real, tuRes: marcador, gane, hayGanador: r.hayGanador, ganador: r.ganadores[0]?.nombre, premio: r.premioPorGanador, comisionApp: r.comisionApp, boteAcumulado: r.boteAcumulado, compartido: r.compartido });
  }

  if (res) {
    return (
      <div style={wrap}>
        <Header titulo="Resultado" sub={`Código ${cfg.codigo}`} onBack={onSalir} />
        <div style={{ textAlign: 'center', margin: '10px 0 18px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{cfg.partido.local} vs {cfg.partido.visit}</div>
          <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-0.03em', margin: '8px 0' }}>{res.real}</div>
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>Tu pronóstico: {res.tuRes}</div>
        </div>
        {res.gane ? (
          <Box ok headline="¡Acertaste!" detalle={`${res.compartido ? 'Compartido (50/50). ' : ''}Ganas ${res.premio} fichas.`} comision={res.comisionApp} />
        ) : res.hayGanador ? (
          <Box headline={`Ganó ${res.ganador}`} detalle="Esta vez no fue tu marcador. ¡A por la siguiente!" comision={res.comisionApp} />
        ) : (
          <Box headline="Nadie acertó" detalle={`El bote de ${res.boteAcumulado} fichas se acumula. Sigue o retírate recuperando la mitad.`} />
        )}
        {res.hayGanador ? (
          <>
            <button onClick={onSiguiente} style={{ ...btnPrimary, marginTop: 4 }}>Otra porra</button>
            <button onClick={onSalir} style={{ ...btnPrimary, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--line)', marginTop: 11 }}>Salir</button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 11, marginTop: 4 }}>
            <button onClick={onSiguiente} style={{ ...btnPrimary, flex: 1 }}>Seguir</button>
            <button onClick={onRetirar} style={{ ...btnPrimary, flex: 1, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--line)' }}>Retirarme +{Math.round(cfg.mesa / 2)}</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={wrap}>
      <Header titulo="Calentada" sub={`Código ${cfg.codigo} · ${amigos.length} amigos`} onBack={onSalir} />
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 17, fontWeight: 800 }}>{cfg.partido.local} vs {cfg.partido.visit}</div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 3 }}>Mesa {cfg.mesa} · bote {boteTotal}{hayBote ? ' · media entrada' : ''}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, margin: '22px 0' }}>
        <Col nombre={cfg.partido.local} valor={golL} set={setGolL} />
        <span style={{ fontSize: 36, color: 'var(--text-faint)', paddingBottom: 34 }}>–</span>
        <Col nombre={cfg.partido.visit} valor={golV} set={setGolV} />
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 9 }}>Marcadores ya cogidos:</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
        {Object.keys(cuenta).length === 0 && <span style={chip(false)}>Ninguno todavía</span>}
        {Object.entries(cuenta).map(([r, c]) => <span key={r} style={chip(c >= 2)}>{r} ×{c}</span>)}
      </div>
      <button onClick={confirmar} style={btnPrimary}>Confirmar · {coste} fichas</button>
      <div style={{ fontSize: 13, color: 'var(--red)', textAlign: 'center', minHeight: 18, marginTop: 12 }}>{error}</div>
    </div>
  );
}

function Col({ nombre, valor, set }) {
  const b = { width: 34, height: 30, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--line)', color: 'var(--text)', fontSize: 16, fontWeight: 700, cursor: 'pointer' };
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8, maxWidth: 90, fontWeight: 600 }}>{nombre}</div>
      <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, width: 72, fontVariantNumeric: 'tabular-nums' }}>{valor}</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
        <button onClick={() => set((v) => Math.max(0, v - 1))} style={b}>−</button>
        <button onClick={() => set((v) => Math.min(9, v + 1))} style={b}>+</button>
      </div>
    </div>
  );
}

function Box({ ok, headline, detalle, comision }) {
  return (
    <div style={{ borderRadius: 14, padding: '20px 18px', textAlign: 'center', marginBottom: 16, background: ok ? 'rgba(22,194,100,0.1)' : 'var(--bg-card)', border: '1px solid ' + (ok ? 'rgba(22,194,100,0.35)' : 'var(--line-soft)') }}>
      <div style={{ fontSize: 19, fontWeight: 800, color: ok ? 'var(--green)' : 'var(--text)' }}>{headline}</div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 7, lineHeight: 1.45 }}>{detalle}</div>
      {comision > 0 && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>Comisión de la casa: {comision} fichas</div>}
    </div>
  );
}

const chip = (full) => ({ fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 8, background: full ? 'rgba(255,90,90,0.12)' : 'var(--bg-card-2)', color: full ? 'var(--red)' : 'var(--text-dim)', border: '1px solid ' + (full ? 'rgba(255,90,90,0.3)' : 'var(--line)') });
