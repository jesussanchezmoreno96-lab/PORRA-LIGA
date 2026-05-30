// Pantalla para unirse a un Modo Héroe con código de invitación (6 caracteres).
// En el prototipo, unirse genera un grupo simulado con ese código.
import { useState } from 'react';
import { HEROE_ENTRADA } from './heroe.js';
import { wrap, btnPrimary } from './heroeStyles.js';
import { Header, Aviso } from './heroeUI.jsx';

export default function HeroeJoin({ saldo, onUnirse, onBack }) {
  const [codigo, setCodigo] = useState('');
  const limpio = codigo.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  const puede = saldo >= HEROE_ENTRADA;
  const valido = limpio.length === 6;
  return (
    <div style={wrap}>
      <Header titulo="Unirse a un grupo" sub="Modo Héroe" onBack={onBack} />
      <div style={{ fontSize: 13.5, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 16 }}>
        Introduce el código de 6 caracteres que te ha pasado el creador del grupo.
      </div>
      <input
        value={limpio}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="A7K2Q9"
        inputMode="text"
        autoCapitalize="characters"
        style={{ width: '100%', textAlign: 'center', letterSpacing: '0.3em', fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 30, padding: '16px 12px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--line)', color: 'var(--text)', textTransform: 'uppercase' }}
      />
      <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>
        Entrada: <b style={{ color: 'var(--gold)' }}>{HEROE_ENTRADA} fichas</b> · tu saldo: <b style={{ color: 'var(--text)' }}>{saldo}</b>
      </div>
      {!puede && <Aviso txt={`Necesitas ${HEROE_ENTRADA} fichas para unirte.`} />}
      <button
        onClick={() => onUnirse(limpio)}
        disabled={!valido || !puede}
        style={{ ...btnPrimary, marginTop: 16, opacity: (!valido || !puede) ? 0.4 : 1 }}
      >
        Unirme y pagar {HEROE_ENTRADA}
      </button>
    </div>
  );
}
