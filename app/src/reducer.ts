

import type { Action, AppState } from "./types.js";

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "task/added":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: action.payload.id,
            title: action.payload.title,
            done: false,
            priority: "normal",
          },
        ],
      };

    case "task/toggled":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, done: !task.done } : task,
        ),
      };

    case "task/removed":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };

    case "task/priority-set":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, priority: action.payload.priority }
            : task,
        ),
      };

    case "filter/set":
      return { ...state, filter: action.payload.filter };

    default:
      return state;
  }
}
