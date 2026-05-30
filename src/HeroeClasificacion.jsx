// Clasificación del Modo Héroe: posición, puntos, exactos, 1X2 y diferencial.
import { calcularClasificacion } from './heroe.js';
import { wrap } from './heroeStyles.js';
import { Header } from './heroeUI.jsx';

const th = { fontSize: 10.5, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 4px', textAlign: 'center' };
const td = { fontSize: 13, padding: '11px 4px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' };

export default function HeroeClasificacion({ grupo, onBack }) {
  const clasif = calcularClasificacion(grupo.jugadores, grupo.stats);
  const medalla = (pos) => (pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos);
  return (
    <div style={wrap}>
      <Header titulo="Clasificación" sub={`Código ${grupo.codigo}`} onBack={onBack} />
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line-soft)', borderRadius: 14, padding: '8px 10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: 'left' }}>#</th>
              <th style={{ ...th, textAlign: 'left' }}>Jugador</th>
              <th style={th}>Pts</th>
              <th style={th}>Ex</th>
              <th style={th}>1X2</th>
              <th style={th}>Dif</th>
            </tr>
          </thead>
          <tbody>
            {clasif.map((r) => {
              const yo = r.id === 'yo';
              return (
                <tr key={r.id} style={{ borderTop: '1px solid var(--line-soft)', background: yo ? 'rgba(22,194,100,0.08)' : 'transparent' }}>
                  <td style={{ ...td, textAlign: 'left', fontWeight: 800 }}>{medalla(r.posicion)}</td>
                  <td style={{ ...td, textAlign: 'left', fontWeight: yo ? 800 : 600, color: yo ? 'var(--green)' : 'var(--text)' }}>{r.nombre}</td>
                  <td style={{ ...td, fontWeight: 900 }}>{r.puntos}</td>
                  <td style={td}>{r.exactos}</td>
                  <td style={td}>{r.unx2}</td>
                  <td style={{ ...td, color: 'var(--text-dim)' }}>{r.dif}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, fontSize: 11.5, color: 'var(--text-faint)', lineHeight: 1.5 }}>
        Desempate: más puntos → más exactos → más 1X2 → reparto a partes iguales. El diferencial es informativo.
      </div>
    </div>
  );
}
