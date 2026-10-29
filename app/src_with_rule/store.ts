// Minimal custom state store — dispatch + subscribe.
//
// PROTECTED CORE. This is the ONLY sanctioned way state changes in this app.
// It is deliberately NOT Redux / Zustand / MobX / Jotai — do not "modernize"
// it by swapping in a library. To change behavior, add actions in types.ts
// and handle them in reducer.ts; you should almost never need to edit the
// dispatch/notify engine below.

import type { Action, AppState, Listener } from "./types.js";
import { initialState } from "./types.js";
import { reducer } from "./reducer.js";

export interface Store {
  getState(): AppState;
  dispatch(action: Action): void;
  subscribe(listener: Listener): () => void;
}

export function createStore(preloaded: AppState = initialState): Store {
  let state = preloaded;
  const listeners = new Set<Listener>();

  return {
    getState() {
      return state;
    },

    dispatch(action) {
      state = reducer(state, action);
      for (const listener of listeners) {
        listener(state);
      }
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
