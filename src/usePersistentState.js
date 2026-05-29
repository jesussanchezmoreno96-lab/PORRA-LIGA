import { useState, useEffect, useRef } from 'react';

function read(key, initial) {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initial;
  } catch {
    return initial;
  }
}

export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => read(key, initial));
  const prevKey = useRef(key);

  useEffect(() => {
    if (prevKey.current !== key) {
      // La clave cambió (p. ej. al cambiar de competición): recargamos el
      // valor guardado de la nueva clave en vez de sobreescribirlo con el
      // valor de la competición anterior.
      prevKey.current = key;
      setValue(read(key, initial));
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota errors
    }
    // `initial` se omite a propósito: solo se usa como fallback al recargar y
    // valores como [] se recrean en cada render (provocaría un bucle).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return [value, setValue];
}
