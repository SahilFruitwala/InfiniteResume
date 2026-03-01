import { useState, useEffect, useRef } from 'react';

export function useAutosave<T>(_key: string, initialValue: T, _delay = 1000) {
  const [value, setValue] = useState<T>(initialValue);

  // Persistence disabled as per user request
  useEffect(() => {
    // No-op
  }, []);

  return [value, setValue] as const;
}
