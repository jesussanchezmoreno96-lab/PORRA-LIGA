// Contenedor de Porra Caliente. Orquesta la navegación interna de los dos
// submodos (Calentada y Modo Héroe) y mantiene su estado persistente.
// Recibe saldo/setSaldo/setIngresosApp de App.jsx (fuente única de economía).
import { useState } from 'react';
import { usePersistentState } from './usePersistentState.js';
import PorraCalienteSelect from './PorraCalienteSelect.jsx';
import HeroeCreate from './HeroeCreate.jsx';
import { wrap, btnPrimary } from './heroeStyles.js';
import { Header } from './heroeUI.jsx';
import HeroeJoin from './HeroeJoin.jsx';
import HeroeJornada from './HeroeJornada.jsx';
import HeroeClasificacion from './HeroeClasificacion.jsx';
import HeroeFinal from './HeroeFinal.jsx';
import CalentadaCreate from './CalentadaCreate.jsx';
import CalentadaJoin from './CalentadaJoin.jsx';
import CalentadaPorra from './CalentadaPorra.jsx';
import { crearGrupoHeroe, simularCierreJornada, HEROE_ENTRADA } from './heroe.js';
import { calcularRetirada } from './logic.js';

export default function PorraCaliente({ compObj, saldo, setSaldo, setIngresosApp, onExit }) {
  const [vista, setVista] = useState('select'); // select | heroe-* | calentada-*
  const [grupoHeroe, setGrupoHeroe] = usePersistentState(`porra_heroe_${compObj.id}`, null);
  // Calentada: bote propio (separado de la Porra Normal) + config de la ronda.
  const [calBote, setCalBote] = usePersistentState(`porra_cal_bote_${compObj.id}`, 0);
  const [calCfg, setCalCfg] = useState(null);
  const [calRonda, setCalRonda] = useState(0);

  // --- Acciones Modo Héroe ---
  function entrarHeroe() {
    if (grupoHeroe) setVista(grupoHeroe.estado === 'finalizado' ? 'heroe-final' : 'heroe-jornada');
    else setVista('heroe-menu');
  }
  function inscribir(codigo) {
    const g = crearGrupoHeroe(compObj, codigo);
    if (!g) return; // competición sin partidos suficientes
    setSaldo((s) => s - HEROE_ENTRADA);
    setGrupoHeroe(g);
    setVista('heroe-jornada');
  }
  function cerrarJornada(misPronosticos) {
    const j = grupoHeroe.jornadaActual;
    const sim = simularCierreJornada(grupoHeroe, misPronosticos);
    const fin = j === grupoHeroe.numJornadas - 1;
    setGrupoHeroe({
      ...grupoHeroe,
      pronosticos: { ...grupoHeroe.pronosticos, [j]: sim.pron },
      reales: { ...grupoHeroe.reales, [j]: sim.reales },
      stats: sim.stats,
      cerradas: grupoHeroe.cerradas.map((c, k) => (k === j ? true : c)),
      jornadaActual: fin ? j : j + 1,
      estado: fin ? 'finalizado' : 'enCurso',
    });
    if (fin) setVista('heroe-final');
  }
  function cobrar(miPremio, totalCasa) {
    if (grupoHeroe.premiado) return;
    if (miPremio > 0) setSaldo((s) => s + miPremio);
    if (totalCasa > 0) setIngresosApp((a) => a + totalCasa);
    setGrupoHeroe({ ...grupoHeroe, premiado: true });
  }
  function nuevoGrupo() { setGrupoHeroe(null); setVista('select'); }

  // --- Acciones Calentada ---
  function crearCal(partido, mesa, codigo) { setCalCfg({ partido, mesa, codigo }); setCalRonda(0); setVista('calentada-porra'); }
  function unirseCal(codigo, mesa) {
    const p = compObj.partidos[Math.floor(Math.random() * compObj.partidos.length)];
    setCalCfg({ partido: p, mesa, codigo }); setCalRonda(0); setVista('calentada-porra');
  }
  function retirarCal() {
    const { devolucionJugador, alBote, alaApp } = calcularRetirada(calCfg.mesa);
    setSaldo((s) => s + devolucionJugador);
    if (alaApp > 0) setIngresosApp((a) => a + alaApp);
    setCalBote(alBote);
    setVista('calentada-menu');
  }

  // --- Router ---
  if (vista === 'select') {
    return <PorraCalienteSelect onPick={(id) => (id === 'heroe' ? entrarHeroe() : setVista('calentada-menu'))} onBack={onExit} />;
  }
  if (vista === 'heroe-menu') {
    return <HeroeMenu onCrear={() => setVista('heroe-create')} onUnirse={() => setVista('heroe-join')} onBack={() => setVista('select')} />;
  }
  if (vista === 'heroe-create') {
    return <HeroeCreate compObj={compObj} saldo={saldo} onCrear={() => inscribir(null)} onBack={() => setVista('heroe-menu')} />;
  }
  if (vista === 'heroe-join') {
    return <HeroeJoin saldo={saldo} onUnirse={(codigo) => inscribir(codigo)} onBack={() => setVista('heroe-menu')} />;
  }
  if (vista === 'heroe-clasif') {
    return <HeroeClasificacion grupo={grupoHeroe} onBack={() => setVista(grupoHeroe.estado === 'finalizado' ? 'heroe-final' : 'heroe-jornada')} />;
  }
  if (vista === 'heroe-final') {
    return <HeroeFinal grupo={grupoHeroe} onCobrar={cobrar} onNuevo={nuevoGrupo} />;
  }
  if (vista === 'heroe-jornada') {
    return (
      <HeroeJornada
        key={grupoHeroe.jornadaActual}
        grupo={grupoHeroe}
        onCerrar={cerrarJornada}
        onVerClasif={() => setVista('heroe-clasif')}
        onExit={() => setVista('select')}
      />
    );
  }

  if (vista === 'calentada-menu') {
    return <HeroeMenu titulo="Calentada" sub="Grupo cerrado entre amigos" onCrear={() => setVista('calentada-create')} onUnirse={() => setVista('calentada-join')} onBack={() => setVista('select')} crearTxt="Crear grupo" unirseTxt="Unirme con código" />;
  }
  if (vista === 'calentada-create') {
    return <CalentadaCreate compObj={compObj} onCrear={crearCal} onBack={() => setVista('calentada-menu')} />;
  }
  if (vista === 'calentada-join') {
    return <CalentadaJoin onUnirse={unirseCal} onBack={() => setVista('calentada-menu')} />;
  }
  if (vista === 'calentada-porra') {
    return (
      <CalentadaPorra
        key={calRonda}
        cfg={calCfg}
        calBote={calBote}
        saldo={saldo}
        setSaldo={setSaldo}
        setIngresosApp={setIngresosApp}
        setCalBote={setCalBote}
        onSiguiente={() => setCalRonda((n) => n + 1)}
        onRetirar={retirarCal}
        onSalir={() => setVista('calentada-menu')}
      />
    );
  }

  return null;
}

function HeroeMenu({ titulo = 'El Trono', sub = 'Liguilla 5 jornadas', crearTxt = 'Crear grupo nuevo', unirseTxt = 'Unirme con código', onCrear, onUnirse, onBack }) {
  return (
    <div style={wrap}>
      <Header titulo={titulo} sub={sub} onBack={onBack} />
      <button onClick={onCrear} style={{ ...btnPrimary, marginBottom: 12 }}>{crearTxt}</button>
      <button onClick={onUnirse} style={{ ...btnPrimary, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--line)' }}>{unirseTxt}</button>
    </div>
  );
}
