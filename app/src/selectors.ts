// Selectors — pure read helpers derived from state. UI reads state through
// selectors instead of poking at `state.tasks` directly, so filtering logic
// lives in one place.

import type { AppState, Task } from "./types.js";

function tasksByDone(tasks: Task[], done: boolean): Task[] {
  return tasks.filter((task) => task.done === done);
}

export function visibleTasks(state: AppState): Task[] {
  switch (state.filter) {
    case "active":
      return tasksByDone(state.tasks, false);
    case "done":
      return tasksByDone(state.tasks, true);
    case "all":
    default:
      return state.tasks;
  }
}

export function remainingCount(state: AppState): number {
  return tasksByDone(state.tasks, false).length;
}
