// Pantalla final del Modo Héroe: podio, reparto de premios y comisión de la casa.
import { calcularClasificacion, repartoFinal } from './heroe.js';
import { wrap, btnPrimary } from './heroeStyles.js';
import { Header } from './heroeUI.jsx';

export default function HeroeFinal({ grupo, onCobrar, onNuevo }) {
  const clasif = calcularClasificacion(grupo.jugadores, grupo.stats);
  const reparto = repartoFinal(grupo.bote, clasif);
  const miPremio = reparto.premios.find((p) => p.id === 'yo')?.fichas || 0;
  const cobrado = !!grupo.premiado;
  const podio = clasif.slice(0, 3);
  const fichasDe = (id) => reparto.premios.find((p) => p.id === id)?.fichas || 0;
  const medalla = ['🥇', '🥈', '🥉'];

  return (
    <div style={wrap}>
      <Header titulo="¡Liga terminada!" sub={`Bote ${grupo.bote} fichas`} onBack={onNuevo} />

      <div style={{ textAlign: 'center', margin: '6px 0 20px' }}>
        <div style={{ fontSize: 44 }}>🏆</div>
        <div style={{ fontSize: 18, fontWeight: 900 }}>{clasif[0]?.nombre}</div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>campeón con {clasif[0]?.puntos} puntos</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {podio.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: r.id === 'yo' ? 'rgba(22,194,100,0.1)' : 'var(--bg-card)', border: '1px solid ' + (r.id === 'yo' ? 'rgba(22,194,100,0.35)' : 'var(--line-soft)'), borderRadius: 12, padding: '13px 15px' }}>
            <span style={{ fontSize: 22 }}>{medalla[i]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: r.id === 'yo' ? 'var(--green)' : 'var(--text)' }}>{r.nombre}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>{r.puntos} pts · {r.exactos} exactos</div>
            </div>
            <div style={{ fontWeight: 900, color: 'var(--gold)' }}>+{fichasDe(r.id)}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: '12px 15px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--line-soft)', fontSize: 13, color: 'var(--text-dim)' }}>
        Comisión de la casa: <b style={{ color: 'var(--gold)' }}>{reparto.totalCasa} fichas</b>
        <span style={{ fontSize: 11 }}> (10% + no repartido)</span>
        <div style={{ marginTop: 6, color: 'var(--text)' }}>Tu premio: <b style={{ color: miPremio > 0 ? 'var(--green)' : 'var(--text-faint)' }}>{miPremio} fichas</b></div>
      </div>

      {!cobrado ? (
        <button onClick={() => onCobrar(miPremio, reparto.totalCasa)} style={{ ...btnPrimary, marginTop: 16 }}>
          Cobrar premios
        </button>
      ) : (
        <>
          <div style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 700, marginTop: 16, fontSize: 14 }}>✓ Premios cobrados</div>
          <button onClick={onNuevo} style={{ ...btnPrimary, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--line)', marginTop: 12 }}>
            Nuevo grupo
          </button>
        </>
      )}
    </div>
  );
}
