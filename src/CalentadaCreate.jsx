// Calentada — crear grupo cerrado: elegir partido + mesa, genera código a compartir.
import { useState } from 'react';
import { MESAS } from './data.js';
import { generarCodigo } from './heroe.js';
import { wrap, btnPrimary } from './heroeStyles.js';
import { Header } from './heroeUI.jsx';

export default function CalentadaCreate({ compObj, onCrear, onBack }) {
  const [codigo] = useState(() => generarCodigo());
  const [pIdx, setPIdx] = useState(0);
  const [mesa, setMesa] = useState(MESAS[0]);
  const partido = compObj.partidos[pIdx];

  return (
    <div style={wrap}>
      <Header titulo="Crear Calentada" sub="Grupo cerrado" onBack={onBack} />

      <div style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px dashed var(--green)', borderRadius: 14, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Código del grupo</div>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '0.25em', color: 'var(--green)', marginTop: 4 }}>{codigo}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 4 }}>Compártelo con tus amigos</div>
      </div>

      <div style={lbl}>Partido</div>
      <select value={pIdx} onChange={(e) => setPIdx(Number(e.target.value))} style={sel}>
        {compObj.partidos.map((p, i) => <option key={p.id} value={i}>{p.local} vs {p.visit}</option>)}
      </select>

      <div style={{ ...lbl, marginTop: 16 }}>Mesa (fichas)</div>
      <div style={{ display: 'flex', gap: 10 }}>
        {MESAS.map((m) => (
          <button key={m} onClick={() => setMesa(m)} style={{ flex: 1, padding: '14px 0', borderRadius: 12, fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 20, cursor: 'pointer', border: '1px solid ' + (mesa === m ? 'var(--green)' : 'var(--line)'), background: mesa === m ? 'rgba(22,194,100,0.15)' : 'var(--bg-card)', color: mesa === m ? 'var(--green)' : 'var(--text)' }}>{m}</button>
        ))}
      </div>

      <button onClick={() => onCrear(partido, mesa, codigo)} style={{ ...btnPrimary, marginTop: 20 }}>Crear y entrar</button>
    </div>
  );
}

const lbl = { fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 9 };
const sel = { width: '100%', padding: '13px 14px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--line)', color: 'var(--text)', fontFamily: 'Archivo, sans-serif', fontSize: 15, fontWeight: 600 };
