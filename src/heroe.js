// Lógica del Modo Héroe (liguilla competitiva de 5 jornadas).
// Independiente de logic.js (porras normales). Funciones puras + helpers de
// simulación para el prototipo de un solo jugador (amigos-bot).
import { MARCADORES_PROBABLES } from './data.js';

// --- Constantes del modo (ajustables) ---
export const HEROE_ENTRADA = 20;            // fichas obligatorias por jugador
export const HEROE_JORNADAS = 5;
export const HEROE_PARTIDOS_POR_JORNADA = 5;
export const HEROE_MAX_JUGADORES = 10;
export const HEROE_COMISION = 0.10;         // 10% casa antes del reparto
export const HEROE_REPARTO = [0.60, 0.30, 0.10]; // 1º, 2º, 3º del repartible

// Amigos-bot con género para el sufijo "(amigo)" / "(amiga)".
const AMIGOS = [
  { n: 'Carlos', g: 'm' }, { n: 'Marta', g: 'f' }, { n: 'Javi', g: 'm' },
  { n: 'Lucía', g: 'f' }, { n: 'Dani', g: 'm' }, { n: 'Sara', g: 'f' },
  { n: 'Nacho', g: 'm' }, { n: 'Paula', g: 'f' }, { n: 'Álvaro', g: 'm' },
  { n: 'Rocío', g: 'f' }, { n: 'Hugo', g: 'm' }, { n: 'Noa', g: 'f' },
];

// --- Helpers internos ---
function parse(res) { const [l, v] = res.split('-').map(Number); return [l, v]; }
function signo(l, v) { return l > v ? 1 : l < v ? -1 : 0; }
function pickPonderado() {
  // Marcadores más probables primero (peso decreciente).
  const pesos = MARCADORES_PROBABLES.map((_, i) => MARCADORES_PROBABLES.length - i);
  const total = pesos.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < MARCADORES_PROBABLES.length; i++) {
    r -= pesos[i];
    if (r <= 0) return MARCADORES_PROBABLES[i];
  }
  return MARCADORES_PROBABLES[0];
}

// --- Generación de grupo / amigos / partidos / código ---
export function generarAmigosBot(n) {
  const barajados = [...AMIGOS].sort(() => Math.random() - 0.5).slice(0, n);
  return barajados.map((a, i) => ({
    id: 'bot' + i,
    nombre: `${a.n} (${a.g === 'm' ? 'amigo' : 'amiga'})`,
    bot: true,
    pagado: true,
  }));
}

export function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I para legibilidad
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// Elige los partidos de cada jornada/fase según la config de la competición
// (compObj.heroe). Si hay `dias`, cada fase coge `partidosPorJornada` partidos
// de ese día concreto (variante semanal Champions: Martes/Miércoles). Si no,
// elige `partidosPorJornada` aleatorios por jornada (variante liga LaLiga).
// Devuelve null si no hay partidos suficientes.
export function elegirPartidosJornadas(compObj) {
  const { partidos } = compObj;
  const { jornadas, partidosPorJornada, dias } = compObj.heroe;
  if (dias) {
    const fases = dias.map((d) => {
      const delDia = (partidos || []).filter((p) => p.dia === d);
      if (delDia.length < partidosPorJornada) return null;
      return [...delDia].sort(() => Math.random() - 0.5).slice(0, partidosPorJornada);
    });
    return fases.some((f) => f === null) ? null : fases;
  }
  if (!partidos || partidos.length < partidosPorJornada) return null;
  const out = [];
  for (let j = 0; j < jornadas; j++) {
    out.push([...partidos].sort(() => Math.random() - 0.5).slice(0, partidosPorJornada));
  }
  return out;
}

// Crea el estado inicial del grupo Héroe (con el jugador ya inscrito y pagado).
export function crearGrupoHeroe(compObj, codigo) {
  const partidos = elegirPartidosJornadas(compObj);
  if (!partidos) return null;
  const nAmigos = 4 + Math.floor(Math.random() * 6); // 4..9 amigos
  const amigos = generarAmigosBot(nAmigos);
  const jugadores = [{ id: 'yo', nombre: 'Tú', bot: false, pagado: true }, ...amigos];
  return {
    codigo: codigo || generarCodigo(),
    estado: 'enCurso',
    jugadores,
    bote: jugadores.length * HEROE_ENTRADA,
    partidos,
    numJornadas: partidos.length,            // nº de fases (5 liga / 2 semanal)
    etiquetas: compObj.heroe.etiquetas || null, // ['Martes','Miércoles'] o null
    jornadaActual: 0,
    cerradas: Array(partidos.length).fill(false),
    pronosticos: {}, // { [jornada]: { [jugId]: [pred] } }
    reales: {},      // { [jornada]: [real] }
    stats: {},       // { [jugId]: { puntos, exactos, unx2, dif } }
  };
}

// --- Puntuación ---
// pred/real con formato 'L-V'. Devuelve puntos y flags.
export function puntuarPartido(pred, real) {
  if (!pred) return { puntos: 0, exacto: false, acierto1x2: false, difGoles: null };
  const [pl, pv] = parse(pred);
  const [rl, rv] = parse(real);
  const exacto = pl === rl && pv === rv;
  const mismo1x2 = signo(pl, pv) === signo(rl, rv);
  const difGoles = Math.abs((pl + pv) - (rl + rv));
  let puntos = 0;
  if (exacto) puntos = 3;
  else if (mismo1x2) puntos = 1;
  // acierto1x2 = acierto de 1X2 SIN ser exacto (los casos de "1 punto")
  return { puntos, exacto, acierto1x2: mismo1x2 && !exacto, difGoles };
}

// Puntúa una jornada completa para todos los jugadores, incluyendo el punto
// extra al más cercano cuando nadie acierta el exacto (empate en cercanía = nadie).
// realesJornada: ['L-V' x5]. pronosticosJornada: { jugId: ['L-V' x5] }.
export function puntuarJornada(jugadores, realesJornada, pronosticosJornada) {
  const res = {};
  jugadores.forEach((j) => { res[j.id] = { puntos: 0, exactos: 0, unx2: 0, dif: 0, detalle: [] }; });

  for (let m = 0; m < realesJornada.length; m++) {
    const real = realesJornada[m];
    const porJugador = {};
    let alguienExacto = false;
    jugadores.forEach((j) => {
      const pred = (pronosticosJornada[j.id] || [])[m] || null;
      const p = puntuarPartido(pred, real);
      porJugador[j.id] = p;
      if (p.exacto) alguienExacto = true;
    });

    // Punto extra: si nadie acertó el exacto, al de menor diferencia de goles.
    let extraId = null;
    if (!alguienExacto) {
      let mejor = Infinity; let cands = [];
      jugadores.forEach((j) => {
        const d = porJugador[j.id].difGoles;
        if (d == null) return;
        if (d < mejor) { mejor = d; cands = [j.id]; }
        else if (d === mejor) cands.push(j.id);
      });
      if (cands.length === 1) extraId = cands[0]; // empate en cercanía → nadie
    }

    jugadores.forEach((j) => {
      const p = porJugador[j.id];
      let pts = p.puntos;
      if (j.id === extraId) pts += 1;
      res[j.id].puntos += pts;
      if (p.exacto) res[j.id].exactos += 1;
      if (p.acierto1x2) res[j.id].unx2 += 1;
      if (p.difGoles != null) res[j.id].dif += p.difGoles;
      res[j.id].detalle.push({
        pred: (pronosticosJornada[j.id] || [])[m] || null,
        real, puntos: pts, exacto: p.exacto, extra: j.id === extraId,
      });
    });
  }
  return res;
}

// Suma los resultados de una jornada al acumulado de stats.
export function acumularStats(acum, jornadaRes) {
  const out = { ...acum };
  Object.keys(jornadaRes).forEach((id) => {
    const a = out[id] || { puntos: 0, exactos: 0, unx2: 0, dif: 0 };
    const j = jornadaRes[id];
    out[id] = {
      puntos: a.puntos + j.puntos,
      exactos: a.exactos + j.exactos,
      unx2: a.unx2 + j.unx2,
      dif: a.dif + j.dif,
    };
  });
  return out;
}

// Clasificación ordenada con desempates en cascada: puntos → exactos → 1X2.
// El diferencial solo ordena visualmente (no decide premio). Jugadores iguales
// en los 3 criterios comparten posición (empate real → reparto a partes iguales).
export function calcularClasificacion(jugadores, stats) {
  const arr = jugadores.map((j) => ({
    id: j.id, nombre: j.nombre, bot: j.bot,
    ...(stats[j.id] || { puntos: 0, exactos: 0, unx2: 0, dif: 0 }),
  }));
  arr.sort((a, b) =>
    b.puntos - a.puntos ||
    b.exactos - a.exactos ||
    b.unx2 - a.unx2 ||
    a.dif - b.dif);
  let pos = 0; let prev = null;
  arr.forEach((row, i) => {
    const empata = prev && prev.puntos === row.puntos && prev.exactos === row.exactos && prev.unx2 === row.unx2;
    if (!empata) pos = i + 1;
    row.posicion = pos;
    prev = row;
  });
  return arr;
}

// Reparto final del bote tras la jornada 5.
// Solo entran jugadores con puntos > 0. Empates comparten a partes iguales la
// suma de los premios de las posiciones que ocupan. Lo no repartido → casa.
export function repartoFinal(bote, clasificacion) {
  const comision = Math.round(bote * HEROE_COMISION);
  const repartible = bote - comision;
  const slotFichas = HEROE_REPARTO.map((p) => Math.round(repartible * p)); // [60%,30%,10%]

  const elegibles = clasificacion.filter((r) => r.puntos > 0);
  const premios = [];
  let repartido = 0;
  let slot = 0; // índice 0..2 en slotFichas
  let i = 0;
  while (i < elegibles.length && slot < HEROE_REPARTO.length) {
    const grupo = [elegibles[i]];
    let k = i + 1;
    while (k < elegibles.length && elegibles[k].posicion === elegibles[i].posicion) {
      grupo.push(elegibles[k]); k++;
    }
    const slotsOcupados = Math.min(grupo.length, HEROE_REPARTO.length - slot);
    let suma = 0;
    for (let s = 0; s < slotsOcupados; s++) suma += slotFichas[slot + s];
    const porCabeza = Math.floor(suma / grupo.length);
    grupo.forEach((g) => {
      premios.push({ id: g.id, nombre: g.nombre, fichas: porCabeza, posicion: g.posicion });
      repartido += porCabeza;
    });
    slot += grupo.length;
    i = k;
  }

  const sobranteCasa = repartible - repartido; // posiciones vacías + redondeos
  return {
    comisionApp: comision,          // 10% del bote
    premios,                        // [{id,nombre,fichas,posicion}]
    sobranteCasa,                   // no repartido → casa
    totalCasa: comision + sobranteCasa,
  };
}

// --- Simulación de cierre de jornada (prototipo single-player) ---
// Genera resultados reales y pronósticos de los amigos-bot, puntúa y acumula.
export function simularCierreJornada(grupo, misPronosticos) {
  const j = grupo.jornadaActual;
  const partidosJ = grupo.partidos[j];
  const reales = partidosJ.map(() => pickPonderado());
  const pron = { yo: misPronosticos };
  grupo.jugadores.filter((x) => x.bot).forEach((b) => {
    pron[b.id] = partidosJ.map(() => pickPonderado());
  });
  const jornadaRes = puntuarJornada(grupo.jugadores, reales, pron);
  const stats = acumularStats(grupo.stats, jornadaRes);
  return { reales, pron, jornadaRes, stats };
}
