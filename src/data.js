// Competiciones disponibles. Cada una tiene sus propios partidos y jornada.
// El bote, la jornada y el historial se guardan POR competición (claves
// porra_bote_<id>, etc. en App.jsx). El saldo de fichas es común al usuario.
export const COMPETICIONES = {
  laliga: {
    id: 'laliga',
    nombre: 'LaLiga EA Sports',
    division: 'Primera División',
    pill: 'EA Sports',         // texto corto para el indicador de la cabecera
    color: '#16c264',          // verde distintivo
    icono: '🏆',
    activa: true,
    jornada: 38,               // jornada 38 real 2025/26 (última jornada)
    partidos: [
      { id: 1, local: 'Alavés', visit: 'Rayo Vallecano' },
      { id: 2, local: 'Betis', visit: 'Levante' },
      { id: 3, local: 'Celta', visit: 'Sevilla' },
      { id: 4, local: 'Espanyol', visit: 'Real Sociedad' },
      { id: 5, local: 'Getafe', visit: 'Osasuna' },
      { id: 6, local: 'Mallorca', visit: 'Oviedo' },
      { id: 7, local: 'Real Madrid', visit: 'Athletic' },
      { id: 8, local: 'Villarreal', visit: 'Atlético' },
      { id: 9, local: 'Valencia', visit: 'Barça' },
      { id: 10, local: 'Girona', visit: 'Elche' },
    ],
    // Modalidades soportadas y configuración del Modo Héroe.
    modalidades: { normal: true, calentada: true, heroe: true },
    heroe: { jornadas: 5, partidosPorJornada: 5, etiquetas: null, dias: null },
  },
  hypermotion: {
    id: 'hypermotion',
    nombre: 'LaLiga Hypermotion',
    division: 'Segunda División',
    pill: 'Hypermotion',
    color: '#3b82f6',          // azul distintivo
    icono: '⚽',
    activa: false,             // "Próximamente" — visible pero deshabilitada
    jornada: 42,
    partidos: [],
    modalidades: { normal: true, calentada: true, heroe: true },
    heroe: { jornadas: 5, partidosPorJornada: 5, etiquetas: null, dias: null },
  },
  champions: {
    id: 'champions',
    nombre: 'UEFA Champions League',
    division: 'Competición continental',
    pill: 'Champions',
    color: '#3b6fe0',          // azul europeo (icono genérico, sin marca UEFA)
    icono: '⭐',
    activa: true,
    jornada: 1,
    // Champions: porra normal (grupo abierto), Calentada y Modo Héroe.
    modalidades: { normal: true, calentada: true, heroe: true },
    // Variante SEMANAL del Héroe: 2 fases (Martes/Miércoles) de 3 partidos = 6.
    // Desbloqueo secuencial martes → miércoles, reparto al cerrar la 2ª fase.
    heroe: { jornadas: 2, partidosPorJornada: 3, etiquetas: ['Martes', 'Miércoles'], dias: ['martes', 'miércoles'] },
    // Fondo atmosférico del card en CompetitionSelect (Unsplash, licencia libre).
    cardBg: 'https://images.unsplash.com/photo-1676746424139-77f8bd8922a8?w=1200&q=70&auto=format&fit=crop',
    // IMPORTANTE: la lista de 32 clubes de Champions cambia cada temporada.
    // Esta es una lista provisional de 16 clubes plausibles para probar la
    // mecánica. Al inicio de cada temporada de Champions, reemplazar por los
    // 32 reales clasificados (y ampliar estos partidos de ejemplo).
    partidos: [
      // Martes
      { id: 1, local: 'Real Madrid', visit: 'Manchester City', dia: 'martes' },
      { id: 2, local: 'Bayern Múnich', visit: 'PSG', dia: 'martes' },
      { id: 3, local: 'Inter', visit: 'Arsenal', dia: 'martes' },
      { id: 4, local: 'Liverpool', visit: 'Atalanta', dia: 'martes' },
      { id: 5, local: 'Barcelona', visit: 'Benfica', dia: 'martes' },
      // Miércoles
      { id: 6, local: 'Atlético Madrid', visit: 'Borussia Dortmund', dia: 'miércoles' },
      { id: 7, local: 'Milan', visit: 'Ajax', dia: 'miércoles' },
      { id: 8, local: 'Juventus', visit: 'Porto', dia: 'miércoles' },
      { id: 9, local: 'PSG', visit: 'Liverpool', dia: 'miércoles' },
      { id: 10, local: 'Arsenal', visit: 'Barcelona', dia: 'miércoles' },
    ],
  },
};

export const COMPETICION_DEFAULT = 'laliga';

// Escudos de los equipos vía API-Football media CDN (sin API key, URLs
// predecibles por id). Uso para PROTOTIPO de validación interna, no comercial.
const API_LOGO = (id) => `https://media.api-sports.io/football/teams/${id}.png`;

export const EQUIPOS = {
  'Real Madrid':    { teamId: 541, logo: API_LOGO(541) },
  'Barça':          { teamId: 529, logo: API_LOGO(529) },
  'Atlético':       { teamId: 530, logo: API_LOGO(530) },
  'Athletic':       { teamId: 531, logo: API_LOGO(531) },
  'Valencia':       { teamId: 532, logo: API_LOGO(532) },
  'Villarreal':     { teamId: 533, logo: API_LOGO(533) },
  'Sevilla':        { teamId: 536, logo: API_LOGO(536) },
  'Celta':          { teamId: 538, logo: API_LOGO(538) },
  'Levante':        { teamId: 539, logo: API_LOGO(539) },
  'Espanyol':       { teamId: 540, logo: API_LOGO(540) },
  'Alavés':         { teamId: 542, logo: API_LOGO(542) },
  'Betis':          { teamId: 543, logo: API_LOGO(543) },
  'Getafe':         { teamId: 546, logo: API_LOGO(546) },
  'Girona':         { teamId: 547, logo: API_LOGO(547) },
  'Real Sociedad':  { teamId: 548, logo: API_LOGO(548) },
  'Oviedo':         { teamId: 718, logo: API_LOGO(718) },
  'Osasuna':        { teamId: 727, logo: API_LOGO(727) },
  'Rayo Vallecano': { teamId: 728, logo: API_LOGO(728) },
  'Elche':          { teamId: 797, logo: API_LOGO(797) },
  'Mallorca':       { teamId: 798, logo: API_LOGO(798) },
  // Clubes europeos (Champions). IDs api-sports verificados.
  'Barcelona':         { teamId: 529, logo: API_LOGO(529) },
  'Atlético Madrid':   { teamId: 530, logo: API_LOGO(530) },
  'Liverpool':         { teamId: 40,  logo: API_LOGO(40) },
  'Manchester City':   { teamId: 50,  logo: API_LOGO(50) },
  'Arsenal':           { teamId: 42,  logo: API_LOGO(42) },
  'Bayern Múnich':     { teamId: 157, logo: API_LOGO(157) },
  'Borussia Dortmund': { teamId: 165, logo: API_LOGO(165) },
  'PSG':               { teamId: 85,  logo: API_LOGO(85) },
  'Inter':             { teamId: 505, logo: API_LOGO(505) },
  'Milan':             { teamId: 489, logo: API_LOGO(489) },
  'Juventus':          { teamId: 496, logo: API_LOGO(496) },
  'Atalanta':          { teamId: 499, logo: API_LOGO(499) },
  'Benfica':           { teamId: 211, logo: API_LOGO(211) },
  'Ajax':              { teamId: 194, logo: API_LOGO(194) },
  'Porto':             { teamId: 212, logo: API_LOGO(212) },
};

// Devuelve la URL del escudo de un equipo por nombre, o null si no está.
export function logoEquipo(name) {
  return EQUIPOS[name]?.logo ?? null;
}

// Alias de compatibilidad (la competición por defecto).
export const JORNADA_INICIAL = COMPETICIONES[COMPETICION_DEFAULT].jornada;
export const PARTIDOS = COMPETICIONES[COMPETICION_DEFAULT].partidos;

// --- Modelo de comisiones de la casa (ajustables para el modelo de negocio) ---
// Comisión sobre el premio: 10% del bote total se descuenta ANTES de repartir
// el premio entre el/los ganador(es).
export const COMISION_PREMIO = 0.10;
// Comisión por retirada: de la mitad que el jugador pierde al retirarse de un
// bote no acertado, este % se lo queda la casa (el resto vuelve al bote).
export const COMISION_RETIRADA = 0.20;

export const MESAS = [2, 5, 10];
export const FICHAS_INICIO = 100;
export const MAX_JUGADORES = 20;
export const MIN_JUGADORES = 5;
export const MAX_POR_RESULTADO = 2;

export const NOMBRES_BOT = [
  'Pepito', 'Lucía', 'Marcos', 'Ana', 'Jorge', 'Nuria', 'Iván', 'Sara',
  'Diego', 'Carla', 'Rubén', 'Elena', 'Hugo', 'Marta', 'Pablo', 'Inés',
  'Raúl', 'Noa', 'Bruno',
];

// Marcadores ponderados de forma realista para el fútbol
export const MARCADORES_PROBABLES = [
  '1-0', '2-1', '1-1', '0-0', '2-0', '0-1', '1-2', '0-2',
  '2-2', '3-0', '3-1', '0-3', '1-3', '3-2', '2-3', '4-0',
];
