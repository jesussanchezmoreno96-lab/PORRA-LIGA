import {
  NOMBRES_BOT, MARCADORES_PROBABLES, MAX_POR_RESULTADO,
} from './data.js';

// Genera N bots con resultados respetando el máx de 2 por marcador
export function generarBots(n) {
  const usados = {};
  const jugadores = [];
  for (let i = 0; i < n && i < NOMBRES_BOT.length; i++) {
    let r;
    let intentos = 0;
    do {
      r = MARCADORES_PROBABLES[Math.floor(Math.random() * MARCADORES_PROBABLES.length)];
      intentos++;
    } while ((usados[r] || 0) >= MAX_POR_RESULTADO && intentos < 50);
    usados[r] = (usados[r] || 0) + 1;
    jugadores.push({ nombre: NOMBRES_BOT[i], res: r, bot: true });
  }
  return jugadores;
}

// Cuenta cuántas personas tienen cada resultado
export function contarResultados(jugadores) {
  const cuenta = {};
  jugadores.forEach((j) => { cuenta[j.res] = (cuenta[j.res] || 0) + 1; });
  return cuenta;
}

// ¿Se puede coger este resultado? (máx 2 personas)
export function resultadoDisponible(jugadores, res) {
  const cuenta = contarResultados(jugadores);
  return (cuenta[res] || 0) < MAX_POR_RESULTADO;
}

// Simula el resultado real del partido (marcador ponderado)
export function simularResultadoReal() {
  // Los primeros marcadores de la lista son más probables: peso decreciente
  const pesos = MARCADORES_PROBABLES.map((_, i) => MARCADORES_PROBABLES.length - i);
  const total = pesos.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < MARCADORES_PROBABLES.length; i++) {
    r -= pesos[i];
    if (r <= 0) return MARCADORES_PROBABLES[i];
  }
  return MARCADORES_PROBABLES[0];
}

// Resuelve la porra. Devuelve quién gana, premios y estado del bote.
export function resolverPorra({ jugadores, boteTotal, resultadoReal, costeEntrada }) {
  const ganadores = jugadores.filter((j) => j.res === resultadoReal);

  if (ganadores.length === 0) {
    // Nadie acierta: el bote se acumula entero a la siguiente jornada
    return {
      ganadores: [],
      premioPorGanador: 0,
      boteAcumulado: boteTotal,
      hayGanador: false,
    };
  }

  const premioPorGanador = Math.round(boteTotal / ganadores.length);
  return {
    ganadores,
    premioPorGanador,
    boteAcumulado: 0,
    hayGanador: true,
    compartido: ganadores.length > 1,
  };
}

// Calcula el coste de entrada según haya bote o no
export function costeEntrada(mesa, hayBote) {
  return hayBote ? mesa / 2 : mesa;
}
