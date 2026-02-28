import { useState, useCallback, useEffect, useRef } from 'react';

export function useHistory<T>(key: string, initialValue: T, delay = 1000) {
  const [past, setPast] = useState<T[]>([]);
  
  const [present, setPresentState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const [future, setFuture] = useState<T[]>([]);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Autosave to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(present));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [key, present, delay]);

  const setPresent = useCallback((newState: T) => {
    setPast((prev) => [...prev, present]);
    setPresentState(newState);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(past.slice(0, past.length - 1));
    setFuture([present, ...future]);
    setPresentState(previous);
  }, [past, present, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(future.slice(1));
    setPast([...past, present]);
    setPresentState(next);
  }, [past, present, future]);

  return {
    state: present,
    set: setPresent,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0
  };
}
