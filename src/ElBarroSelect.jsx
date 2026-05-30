// Submenú de EL BARRO (juego contra gente aleatoria): Calentada (partido suelto,
// activa → porra random actual) y El Trono (liguilla contra random, próximamente).
// Reutiliza PorraCalienteSelect parametrizado para mantener coherencia visual.
import PorraCalienteSelect from './PorraCalienteSelect.jsx';

const OPCIONES_BARRO = [
  { id: 'calentada', icono: '⚡', titulo: 'Calentada', desc: 'Un partido suelto contra gente aleatoria.', color: '#16c264' },
  {
    id: 'heroe', icono: '🦸', titulo: 'El Trono',
    desc: 'Liguilla de 5 jornadas contra gente aleatoria. Disponible cuando lancemos el multijugador real.',
    color: '#f5c542', disabled: true,
  },
];

export default function ElBarroSelect({ onPick, onBack }) {
  return (
    <PorraCalienteSelect
      kicker="🎲 EL BARRO"
      titulo="Elige submodo"
      opciones={OPCIONES_BARRO}
      onPick={onPick}
      onBack={onBack}
    />
  );
}
