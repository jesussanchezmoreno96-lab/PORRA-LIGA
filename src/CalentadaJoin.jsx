// Calentada — unirse a un grupo cerrado con código. En el prototipo, el partido
// del grupo se asigna automáticamente (simula la elección del creador).
import { useState } from 'react';
import { MESAS } from './data.js';
import { wrap, btnPrimary } from './heroeStyles.js';
import { Header } from './heroeUI.jsx';

export default function CalentadaJoin({ onUnirse, onBack }) {
  const [codigo, setCodigo] = useState('');
  const [mesa, setMesa] = useState(MESAS[0]);
  const limpio = codigo.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  const valido = limpio.length === 6;

  return (
    <div style={wrap}>
      <Header titulo="Unirse a Calentada" sub="Grupo cerrado" onBack={onBack} />
      <div style={{ fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 16 }}>
        Introduce el código que te ha pasado el creador.
      </div>
      <input
        value={limpio}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="A7K2Q9"
        autoCapitalize="characters"
        style={{ width: '100%', textAlign: 'center', letterSpacing: '0.3em', fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 30, padding: '16px 12px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--line)', color: 'var(--text)', textTransform: 'uppercase' }}
      />
      <div style={{ ...lbl, marginTop: 18 }}>Mesa (fichas)</div>
      <div style={{ display: 'flex', gap: 10 }}>
        {MESAS.map((m) => (
          <button key={m} onClick={() => setMesa(m)} style={{ flex: 1, padding: '14px 0', borderRadius: 12, fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 20, cursor: 'pointer', border: '1px solid ' + (mesa === m ? 'var(--green)' : 'var(--line)'), background: mesa === m ? 'rgba(22,194,100,0.15)' : 'var(--bg-card)', color: mesa === m ? 'var(--green)' : 'var(--text)' }}>{m}</button>
        ))}
      </div>
      <button onClick={() => onUnirse(limpio, mesa)} disabled={!valido} style={{ ...btnPrimary, marginTop: 20, opacity: valido ? 1 : 0.4 }}>Unirme y entrar</button>
    </div>
  );
}

const lbl = { fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 9 };
