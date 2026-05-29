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
};

// Devuelve la URL del escudo de un equipo por nombre, o null si no está.
export function logoEquipo(name) {
  return EQUIPOS[name]?.logo ?? null;
}

// Alias de compatibilidad (la competición por defecto).
export const JORNADA_INICIAL = COMPETICIONES[COMPETICION_DEFAULT].jornada;
export const PARTIDOS = COMPETICIONES[COMPETICION_DEFAULT].partidos;

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
