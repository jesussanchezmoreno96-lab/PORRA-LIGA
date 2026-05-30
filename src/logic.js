import {
  NOMBRES_BOT, MARCADORES_PROBABLES, MAX_POR_RESULTADO,
  COMISION_PREMIO, COMISION_RETIRADA,
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
export function resolverPorra({ jugadores, boteTotal, resultadoReal }) {
  const ganadores = jugadores.filter((j) => j.res === resultadoReal);

  if (ganadores.length === 0) {
    // Regla 4: nadie acierta y el bote sigue vivo → se acumula entero a la
    // siguiente jornada. La casa NO toca nada.
    return {
      ganadores: [],
      premioPorGanador: 0,
      comisionApp: 0,
      boteAcumulado: boteTotal,
      hayGanador: false,
    };
  }

  // Regla 1: la casa cobra COMISION_PREMIO del bote ANTES de repartir.
  const comisionApp = Math.round(boteTotal * COMISION_PREMIO);
  const repartible = boteTotal - comisionApp;
  const premioPorGanador = Math.round(repartible / ganadores.length);
  return {
    ganadores,
    premioPorGanador, // neto, ya descontada la comisión
    comisionApp,
    boteAcumulado: 0,
    hayGanador: true,
    compartido: ganadores.length > 1,
  };
}

// Regla 2: reparto de una retirada tras un bote no acertado.
// El jugador recupera la mitad de su apuesta (no cambia para él). De la otra
// mitad que pierde, COMISION_RETIRADA va a la casa y el resto vuelve al bote.
export function calcularRetirada(mesa) {
  const devolucionJugador = Math.round(mesa / 2);
  const perdida = mesa - devolucionJugador;
  const alaApp = Math.round(perdida * COMISION_RETIRADA);
  const alBote = perdida - alaApp;
  return { devolucionJugador, alBote, alaApp };
}

// Regla 3: bote inválido. Si TODOS los jugadores se retiran, o queda un solo
// jugador en una jornada con bote y falla, el bote entero va a la casa.
// Devuelve cuánto se lleva la casa y deja el bote a 0. (Hook del modelo: la UI
// single-player actual no lo dispara, pero queda listo para atarlo a un flujo.)
export function boteInvalidoALaCasa(bote) {
  return { alaApp: bote, boteRestante: 0 };
}

// Calcula el coste de entrada según haya bote o no
export function costeEntrada(mesa, hayBote) {
  return hayBote ? mesa / 2 : mesa;
}
