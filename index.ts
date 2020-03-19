import { useState, useCallback } from 'react';

interface State {
  history: any[];
  presentIndex: number;
}

const calculateCanUndo = ({ presentIndex }: State) => presentIndex > 0;

const calculateCanRedo = ({ history, presentIndex }: State) =>
  presentIndex < history.length - 1;

const getPast = ({ history, presentIndex }: State) =>
  history.slice(0, presentIndex);

const getPresent = ({ history, presentIndex }: State) => history[presentIndex];

const getFuture = ({ history, presentIndex }: State) =>
  history.slice(presentIndex + 1);

const createUndo = () => (state: State): State => {
  const { presentIndex } = state;

  return calculateCanUndo(state)
    ? {
        ...state,
        presentIndex: presentIndex - 1,
      }
    : state;
};

const createRedo = () => (state: State): State => {
  const { presentIndex } = state;

  return calculateCanRedo(state)
    ? {
        ...state,
        presentIndex: presentIndex + 1,
      }
    : state;
};

const createSet = (newPresent: any) => (state: State): State => {
  const { history, presentIndex } = state;
  const newHistory = [...history.slice(0, presentIndex + 1), newPresent];

  return {
    history: newHistory,
    presentIndex: newHistory.length - 1,
  };
};

const createReset = (initialPresent: any) => (): State => ({
  history: [initialPresent],
  presentIndex: 0,
});

export default function useUndo(initialPresent: any) {
  const [state, setState] = useState(createReset(initialPresent));

  const canUndo = calculateCanUndo(state);
  const canRedo = calculateCanRedo(state);

  const past = getPast(state);
  const present = getPresent(state);
  const future = getFuture(state);

  const undo = useCallback(() => {
    setState(createUndo());
  }, []);

  const redo = useCallback(() => {
    setState(createRedo());
  }, []);

  const set = useCallback(newPresent => {
    setState(createSet(newPresent));
  }, []);

  const reset = useCallback(() => {
    setState(createReset(initialPresent));
  }, [initialPresent]);

  return {
    past,
    present,
    future,
    canUndo,
    canRedo,
    undo,
    redo,
    set,
    reset,
  };
}
