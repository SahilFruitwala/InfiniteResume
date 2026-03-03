import { useState, useCallback, useRef } from "react";

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialPresent: T, limit = 50) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });
  // Track a version number to cheaply detect changes without JSON.stringify
  const versionRef = useRef(0);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    setState((curr) => {
      if (curr.past.length === 0) return curr;

      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);
      versionRef.current++;

      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((curr) => {
      if (curr.future.length === 0) return curr;

      const next = curr.future[0];
      const newFuture = curr.future.slice(1);
      versionRef.current++;

      return {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const push = useCallback(
    (newPresentOrCompute: T | ((prev: T) => T)) => {
      setState((curr) => {
        const newPresent =
          typeof newPresentOrCompute === "function"
            ? (newPresentOrCompute as (prev: T) => T)(curr.present)
            : (newPresentOrCompute as T);

        // Use referential equality — if the updater returned the same object, skip
        if (newPresent === curr.present) {
          return curr;
        }

        versionRef.current++;
        const newPast = [...curr.past, curr.present].slice(-limit);
        return {
          past: newPast,
          present: newPresent,
          future: [],
        };
      });
    },
    [limit],
  );

  const reset = useCallback((newPresent: T) => {
    versionRef.current = 0;
    setState({
      past: [],
      present: newPresent,
      future: [],
    });
  }, []);

  return {
    state: state.present,
    setState: push,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    version: versionRef.current,
  };
}
