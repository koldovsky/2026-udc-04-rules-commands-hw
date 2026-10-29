

import type { AppState, Task } from "./types.js";

export function visibleTasks(state: AppState): Task[] {
  switch (state.filter) {
    case "active":
      return state.tasks.filter((task) => !task.done);
    case "done":
      return state.tasks.filter((task) => task.done);
    case "all":
    default:
      return state.tasks;
  }
}

export function remainingCount(state: AppState): number {
  return state.tasks.filter((task) => !task.done).length;
}
