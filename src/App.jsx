import { useState } from 'react';
import { COMPETICIONES, MESAS, FICHAS_INICIO, MIN_JUGADORES, MAX_JUGADORES, logoEquipo } from './data.js';
import { generarBots, contarResultados, resultadoDisponible, simularResultadoReal, resolverPorra, costeEntrada } from './logic.js';
import { usePersistentState } from './usePersistentState.js';
import SplashScreen from './SplashScreen.jsx';
import CompetitionSelect from './CompetitionSelect.jsx';

// Migración única: las claves antiguas globales pasan a ser por competición
// (LaLiga EA Sports). El saldo (porra_saldo) es común y no se migra.
function migrarClavesLegacy() {
  try {
    const pares = [
      ['porra_bote', 'porra_bote_laliga'],
      ['porra_jornada', 'porra_jornada_laliga'],
      ['porra_historial', 'porra_historial_laliga'],
    ];
    for (const [viejo, nuevo] of pares) {
      const v = localStorage.getItem(viejo);
      if (v !== null && localStorage.getItem(nuevo) === null) {
        localStorage.setItem(nuevo, v);
      }
      if (v !== null) localStorage.removeItem(viejo);
    }
  } catch {
    // ignore
  }
}

const crestColors = ['#16c264','#3b82f6','#f5c542','#ef4444','#a855f7','#ec4899','#14b8a6','#f97316','#0ea5e9','#84cc16'];
function crestColor(name){ let h=0; for(const c of name) h=(h*31+c.charCodeAt(0))>>>0; return crestColors[h%crestColors.length]; }
function ini(name){ return name.replace(/[^A-Za-zÁÉÍÓÚ ]/g,'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }

// Escudo del equipo: usa el logo real (CDN) con fallback al círculo de
// iniciales si la imagen no carga (404/caída) o el equipo no está mapeado.
function Crest({ name, size = 30 }){
  const [failed, setFailed] = useState(false);
  const logo = logoEquipo(name);
  if (logo && !failed) {
    return (
      <img
        src={logo}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, verticalAlign: 'middle' }}
      />
    );
  }
  const c = crestColor(name);
  return (
    <div
      className="crest"
      style={{ width: size, height: size, fontSize: Math.round(size*0.37), display: 'inline-flex', verticalAlign: 'middle', background: c+'22', color: c }}
    >{ini(name)}</div>
  );
}

migrarClavesLegacy();

export default function App(){
  // Portada de bienvenida: se muestra una vez por sesión (pestaña). Al pulsar
  // ¡JUGAR! se marca en sessionStorage y no reaparece al navegar entre tabs.
  const [splash, setSplash] = useState(() => !sessionStorage.getItem('porra_splash_seen'));

  // Competición seleccionada (null = aún en la pantalla de selección).
  const [comp, setComp] = useState(null);
  const cid = comp || 'laliga';                 // id efectivo para las claves
  const compObj = COMPETICIONES[cid];

  // Saldo: común a todas las competiciones (cartera del usuario).
  const [saldo, setSaldo] = usePersistentState('porra_saldo', FICHAS_INICIO);
  // Bote, jornada e historial: independientes por competición.
  const [historial, setHistorial] = usePersistentState(`porra_historial_${cid}`, []);
  const [bote, setBote] = usePersistentState(`porra_bote_${cid}`, 0);
  const [jornada, setJornada] = usePersistentState(`porra_jornada_${cid}`, compObj.jornada);

  const [tab, setTab] = useState('jugar');
  const [view, setView] = useState('jornada');
  const [partido, setPartido] = useState(null);
  const [mesa, setMesa] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [golL, setGolL] = useState(1);
  const [golV, setGolV] = useState(1);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);

  const hayBote = bote > 0;

  function reset(){
    if(!confirm('¿Reiniciar el juego? Perderás saldo, historial y bote.')) return;
    setSaldo(FICHAS_INICIO); setHistorial([]); setBote(0); setJornada(compObj.jornada);
    setView('jornada'); setTab('jugar');
  }

  function abrirPartido(p){ setPartido(p); setView('mesa'); }
  function elegirMesa(m){ setMesa(m); setView('grupo'); }

  function entrarGrupo(tipo){
    const n = tipo === 'abierto' ? (4 + Math.floor(Math.random()*9)) : 4;
    const jugadores = generarBots(n);
    const coste = costeEntrada(mesa, hayBote);
    const boteTotal = jugadores.length * coste + bote;
    setGrupo({ tipo, jugadores, boteTotal });
    setGolL(1); setGolV(1); setError('');
    setView('porra');
  }

  function confirmar(){
    setError('');
    const res = `${golL}-${golV}`;
    if(!resultadoDisponible(grupo.jugadores, res)){
      setError('Ese resultado ya lo tienen 2 personas. Elige otro marcador.');
      return;
    }
    const coste = costeEntrada(mesa, hayBote);
    if(saldo < coste){ setError('No tienes fichas suficientes.'); return; }

    const nuevoSaldo = saldo - coste;
    const jugadoresFull = [...grupo.jugadores, { nombre:'Tú', res, bot:false }];
    const boteTotal = grupo.boteTotal + coste;
    const real = simularResultadoReal();
    const r = resolverPorra({ jugadores: jugadoresFull, boteTotal, resultadoReal: real, costeEntrada: coste });

    let saldoFinal = nuevoSaldo;
    let delta = -coste;
    if(r.hayGanador && r.ganadores.some(g=>g.nombre==='Tú')){
      saldoFinal += r.premioPorGanador;
      delta += r.premioPorGanador;
      setBote(0);
    } else {
      setBote(r.boteAcumulado);
    }
    setSaldo(saldoFinal);

    const gane = r.hayGanador && r.ganadores.some(g=>g.nombre==='Tú');
    setResultado({
      partido, real, tuRes: res, gane,
      compartido: r.compartido, premio: r.premioPorGanador,
      boteAcumulado: r.boteAcumulado, mesa, hayBote, delta,
    });
    setHistorial([{ jornada, match:`${partido.local} ${real} ${partido.visit}`, tuRes:res, mesa, delta, gane }, ...historial].slice(0,50));
    setView('resultado');
  }

  function seguirBote(){ setJornada(j=>j+1); volverInicio(); }
  function retirarse(){ const dev = Math.round(mesa/2); setSaldo(s=>s+dev); setBote(0); setJornada(j=>j+1); volverInicio(); }
  function siguienteJornada(){ setJornada(j=>j+1); volverInicio(); }
  function volverInicio(){ setPartido(null); setMesa(null); setGrupo(null); setResultado(null); setView('jornada'); setTab('jugar'); }

  const cuenta = grupo ? contarResultados(grupo.jugadores) : {};

  if (splash) {
    return (
      <SplashScreen
        onPlay={() => {
          sessionStorage.setItem('porra_splash_seen', '1');
          setSplash(false);
        }}
      />
    );
  }

  if (!comp) {
    return <CompetitionSelect onSelect={setComp} />;
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-title">
          {tab==='jugar' && view==='jornada' && (
            <>
              <button className="back-btn" onClick={()=>setComp(null)} aria-label="Cambiar competición">‹</button>
              <span className="pill" style={{ background: compObj.color }}>{compObj.pill}</span>
            </>
          )}
          {tab==='jugar' && view!=='jornada' && (
            <>
              <button className="back-btn" onClick={()=>{
                if(view==='mesa') setView('jornada');
                else if(view==='grupo') setView('mesa');
                else if(view==='porra') setView('grupo');
                else volverInicio();
              }} aria-label="Volver">‹</button>
              <span style={{fontSize:15}}>Atrás</span>
            </>
          )}
          {tab!=='jugar' && (
            <>
              <span>Porra</span>
              <span className="pill" style={{ background: compObj.color }}>{compObj.pill}</span>
            </>
          )}
        </div>
        <div className="saldo"><span className="coin">€</span>{saldo}</div>
      </div>

      <div className="content fade-in" key={tab+view}>
        {tab==='jugar' && view==='jornada' && (
          <>
            <div className="screen-title">Jornada {jornada} · {compObj.partidos.length} partidos</div>
            {hayBote && (
              <div className="bote-banner">
                <span className="ico">🔥</span>
                <span className="txt">Bote acumulado: <b>{bote} fichas</b>. Esta jornada entras pagando <b>media entrada</b>.</span>
              </div>
            )}
            <div className="match-list">
              {compObj.partidos.map(p=>(
                <button className="match-card" key={p.id} onClick={()=>abrirPartido(p)}>
                  <div className="team"><Crest name={p.local}/><span className="team-name">{p.local}</span></div>
                  <span className="vs">VS</span>
                  <div className="team right"><span className="team-name">{p.visit}</span><Crest name={p.visit}/></div>
                </button>
              ))}
            </div>
          </>
        )}

        {tab==='jugar' && view==='mesa' && partido && (
          <>
            <div className="match-banner">
              <div className="names" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,flexWrap:'wrap'}}><Crest name={partido.local} size={32}/> {partido.local} <span className="vs">VS</span> <Crest name={partido.visit} size={32}/> {partido.visit}</div>
              <div className="sub">Elige tu mesa</div>
            </div>
            <p className="help-text">Cada mesa es una porra independiente. Entras pagando esa cantidad de fichas{hayBote?' (media entrada por el bote)':''}.</p>
            <div className="opt-list">
              {MESAS.map(m=>{
                const coste = costeEntrada(m, hayBote);
                const puede = saldo >= coste;
                return (
                  <button className="opt-btn" key={m} disabled={!puede} onClick={()=>elegirMesa(m)}>
                    <div className="opt-main">
                      <span className="mesa-amount">{coste}</span>
                      <div><div className="opt-title">Mesa de {m} fichas</div><div className="opt-desc">{hayBote?`Media entrada · normal ${m}`:'Entrada estándar'}</div></div>
                    </div>
                    <span className="opt-right">›</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {tab==='jugar' && view==='grupo' && (
          <>
            <div className="match-banner"><div className="names" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,flexWrap:'wrap'}}><Crest name={partido.local} size={32}/> {partido.local} <span className="vs">VS</span> <Crest name={partido.visit} size={32}/> {partido.visit}</div><div className="sub">Mesa de {mesa} fichas · tipo de grupo</div></div>
            <div className="opt-list">
              <button className="opt-btn" onClick={()=>entrarGrupo('abierto')}>
                <div className="opt-main"><div className="opt-icon">🌐</div><div><div className="opt-title">Grupo abierto</div><div className="opt-desc">Gente aleatoria · hasta {MAX_JUGADORES} jugadores</div></div></div>
                <span className="opt-right">›</span>
              </button>
              <button className="opt-btn" onClick={()=>entrarGrupo('cerrado')}>
                <div className="opt-main"><div className="opt-icon">🔒</div><div><div className="opt-title">Grupo cerrado</div><div className="opt-desc">Gente de confianza con código</div></div></div>
                <span className="opt-right">›</span>
              </button>
            </div>
          </>
        )}

        {tab==='jugar' && view==='porra' && grupo && (
          <>
            <div className="group-stat">
              <span className="left">{partido.local} vs {partido.visit}</span>
              <span className="right"><span>👥 <b>{grupo.jugadores.length}</b>/{MAX_JUGADORES}</span><span>💰 <b>{grupo.boteTotal}</b></span></span>
            </div>
            {grupo.jugadores.length < MIN_JUGADORES && (
              <div className="notice info">Faltan jugadores para el mínimo de {MIN_JUGADORES}. Ahora hay {grupo.jugadores.length}. (En esta demo se juega igual.)</div>
            )}
            <p className="help-text">Elige el resultado exacto del partido. Cada marcador lo pueden coger máximo 2 personas.</p>
            <div className="score-picker">
              <div className="score-col">
                <div className="lbl">{partido.local}</div>
                <div className="stepper">
                  <div className="score-val">{golL}</div>
                  <div className="step-row"><button className="step-btn" onClick={()=>setGolL(v=>Math.max(0,v-1))}>−</button><button className="step-btn" onClick={()=>setGolL(v=>Math.min(9,v+1))}>+</button></div>
                </div>
              </div>
              <span className="score-dash">–</span>
              <div className="score-col">
                <div className="lbl">{partido.visit}</div>
                <div className="stepper">
                  <div className="score-val">{golV}</div>
                  <div className="step-row"><button className="step-btn" onClick={()=>setGolV(v=>Math.max(0,v-1))}>−</button><button className="step-btn" onClick={()=>setGolV(v=>Math.min(9,v+1))}>+</button></div>
                </div>
              </div>
            </div>
            <div className="taken-label">Resultados ya cogidos en el grupo:</div>
            <div className="chips">
              {Object.keys(cuenta).length===0 && <span className="chip free">Ninguno todavía</span>}
              {Object.entries(cuenta).map(([r,c])=>(<span key={r} className={'chip '+(c>=2?'full':'free')}>{r} ×{c}</span>))}
            </div>
            <button className="btn-primary" onClick={confirmar}>Confirmar · {costeEntrada(mesa,hayBote)} fichas</button>
            <div className="error-msg">{error}</div>
          </>
        )}

        {tab==='jugar' && view==='resultado' && resultado && (
          <>
            <div className="result-score">
              <div className="match-sub" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,flexWrap:'wrap'}}><Crest name={resultado.partido.local} size={22}/> {resultado.partido.local} vs <Crest name={resultado.partido.visit} size={22}/> {resultado.partido.visit}</div>
              <div className="big">{resultado.real}</div>
              <div className="yours">Tu pronóstico: {resultado.tuRes}</div>
            </div>
            {resultado.gane ? (
              <div className="result-box win">
                <div className="ico">🏆</div>
                <div className="headline">¡Acertaste!</div>
                <div className="detail">{resultado.compartido?'Compartido con otra persona (50/50). ':''}Ganas <b>{resultado.premio} fichas</b>.</div>
              </div>
            ) : (
              <div className="result-box lose">
                <div className="ico">○</div>
                <div className="headline">Nadie acertó</div>
                <div className="detail">El bote de <b>{resultado.boteAcumulado} fichas</b> se acumula a la jornada {jornada+1}. Puedes seguir pagando media entrada o retirarte y recuperar la mitad de tu apuesta.</div>
              </div>
            )}
            {resultado.gane ? (
              <button className="btn-primary" onClick={siguienteJornada}>Siguiente jornada</button>
            ) : (
              <div className="btn-row">
                <button className="btn-primary" onClick={seguirBote}>Seguir</button>
                <button className="btn-ghost" onClick={retirarse}>Retirarme +{Math.round(resultado.mesa/2)}</button>
              </div>
            )}
          </>
        )}

        {tab==='historial' && (
          <>
            <div className="screen-title">Historial</div>
            {historial.length===0 ? (
              <div className="empty"><span className="ico">📋</span>Aún no has jugado ninguna porra.</div>
            ) : historial.map((h,i)=>(
              <div className="hist-item" key={i}>
                <div className="info"><div className="match">{h.match}</div><div className="meta">J{h.jornada} · mesa {h.mesa} · tu {h.tuRes}</div></div>
                <div className={'delta '+(h.delta>=0?'plus':'minus')}>{h.delta>=0?'+':''}{h.delta}</div>
              </div>
            ))}
          </>
        )}

        {tab==='perfil' && (
          <>
            <div className="screen-title">Tu perfil</div>
            <div className="stat-grid">
              <div className="stat-card"><div className="label">Saldo</div><div className="value">{saldo}</div></div>
              <div className="stat-card"><div className="label">Bote activo</div><div className="value">{bote}</div></div>
              <div className="stat-card"><div className="label">Jornada</div><div className="value">{jornada}</div></div>
              <div className="stat-card"><div className="label">Porras</div><div className="value">{historial.length}</div></div>
            </div>
            <div className="stat-card"><div className="label">Aciertos</div><div className="value">{historial.filter(h=>h.gane).length} / {historial.length}</div></div>
            <button className="reset-link" onClick={reset}>Reiniciar juego</button>
          </>
        )}
      </div>

      <div className="bottom-nav">
        {[['jugar','⚽','Jugar'],['historial','📋','Historial'],['perfil','👤','Perfil']].map(([id,ic,lb])=>(
          <button key={id} className={'nav-item '+(tab===id?'active':'')} onClick={()=>{ setTab(id); if(id==='jugar'&&view!=='resultado') setView('jornada'); }}>
            <span className="nav-ico">{ic}</span>{lb}
          </button>
        ))}
      </div>
    </div>
  );
}
