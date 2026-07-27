// Pure reducer: (state, action) -> new state.
//
// This is where the domain grows: to support a new action, add a variant to
// the `Action` union in types.ts, then handle it here. The reducer NEVER
// mutates `state` in place — it always returns a new object/array. That
// immutability is what lets `subscribe` listeners detect real changes.

import type { Action, AppState } from "./types.js";

function withTasks(state: AppState, tasks: AppState["tasks"]): AppState {
  return { ...state, tasks };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "task/added":
      return withTasks(state, [
        ...state.tasks,
        { id: action.payload.id, title: action.payload.title, done: false },
      ]);

    case "task/toggled":
      return withTasks(
        state,
        state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, done: !task.done } : task,
        ),
      );

    case "task/removed":
      return withTasks(
        state,
        state.tasks.filter((task) => task.id !== action.payload.id),
      );

    case "filter/set":
      return { ...state, filter: action.payload.filter };

    default:
      return state;
  }
}
