// Estilos compartidos por las pantallas de Porra Caliente (objetos inline).
// Archivo sin componentes para no romper react-refresh.
export const wrap = {
  position: 'fixed', inset: 0, zIndex: 85, overflowY: 'auto',
  background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Archivo, sans-serif',
  padding: 'max(18px, env(safe-area-inset-top)) 18px max(28px, env(safe-area-inset-bottom))',
  maxWidth: 480, margin: '0 auto',
};
export const btnPrimary = {
  width: '100%', padding: 15, borderRadius: 14, background: 'var(--green)', color: '#04150b',
  border: 'none', fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: 'pointer',
};
