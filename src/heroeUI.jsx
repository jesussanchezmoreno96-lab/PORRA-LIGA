// Componentes UI compartidos por las pantallas de Porra Caliente.
export function Header({ titulo, sub, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
      <button onClick={onBack} aria-label="Volver" style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--line)', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}>‹</button>
      <div>
        {sub && <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 700 }}>{sub}</div>}
        <div style={{ fontSize: 19, fontWeight: 900, letterSpacing: '-0.02em' }}>{titulo}</div>
      </div>
    </div>
  );
}

export function Aviso({ txt }) {
  return <div style={{ marginTop: 12, padding: '11px 14px', borderRadius: 10, background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.3)', color: '#ff9a9a', fontSize: 13 }}>{txt}</div>;
}
