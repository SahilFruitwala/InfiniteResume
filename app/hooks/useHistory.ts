import { useState, useCallback, useEffect, useRef } from "react";

export function useHistory<T>(key: string, initialValue: T, delay = 1000) {
  const [past, setPast] = useState<T[]>([]);

  const [present, setPresentState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
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
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedState = useRef<T>((() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  })());

  // Autosave to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

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

  const setPresent = useCallback((newState: T | ((prev: T) => T)) => {
    setPresentState((current) => {
      const resolvedState =
        typeof newState === "function"
          ? (newState as Function)(current)
          : newState;
      if (current === resolvedState) return current;
      
      setFuture([]);
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        setPast((prev) => [...prev, lastSavedState.current]);
        lastSavedState.current = resolvedState;
      }, 600);
      
      return resolvedState;
    });
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      // We are in the middle of a burst of typing. Set current as lastSavedState so undoing jumps to the start of burst.
      setPast((prev) => [...prev, lastSavedState.current]);
      lastSavedState.current = present;
    }
    setPast((currentPast) => {
      if (currentPast.length === 0) return currentPast;
      const previous = currentPast[currentPast.length - 1];
      const newPast = currentPast.slice(0, currentPast.length - 1);
      
      setFuture((currentFuture) => [lastSavedState.current, ...currentFuture]);
      setPresentState(previous);
      lastSavedState.current = previous;
      
      return newPast;
    });
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    setFuture((currentFuture) => {
      if (currentFuture.length === 0) return currentFuture;
      const next = currentFuture[0];
      const newFuture = currentFuture.slice(1);
      
      setPast((currentPast) => [...currentPast, lastSavedState.current]);
      setPresentState(next);
      lastSavedState.current = next;
      
      return newFuture;
    });
  }, [future]);

  return {
    state: present,
    set: setPresent,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
