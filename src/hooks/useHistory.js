import { useState, useCallback } from "react";

const INITIAL_STATE = {
  history: [
    {
      tasks: {},
      rootIds: [],
    },
  ],
  currentIndex: 0,
};

export default function useHistory() {
  const [state, setState] = useState(INITIAL_STATE);

  const current = state.history[state.currentIndex];

  const applyChange = useCallback((snapshot) => {
    setState((prev) => {
      const truncated = prev.history.slice(0, prev.currentIndex + 1);
      return {
        history: [...truncated, snapshot],
        currentIndex: truncated.length,
      };
    });
  }, []);

  const goToIndex = useCallback((indexOrFn) => {
    setState((prev) => {
      const index =
        typeof indexOrFn === "function"
          ? indexOrFn(prev.currentIndex)
          : indexOrFn;
      if (index < 0 || index >= prev.history.length) return prev;
      if (index === prev.currentIndex) return prev;
      return { ...prev, currentIndex: index };
    });
  }, []);

  const undo = useCallback(() => goToIndex((i) => i - 1), [goToIndex]);
  const redo = useCallback(() => goToIndex((i) => i + 1), [goToIndex]);

  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  return {
    current,
    applyChange,
    undo,
    redo,
    goToIndex,
    canUndo,
    canRedo,
    currentIndex: state.currentIndex,
    historyLength: state.history.length,
  };
}
