// Selectors — pure read helpers derived from state. UI reads state through
// selectors instead of poking at `state.tasks` directly, so filtering logic
// lives in one place.

import type { AppState, Priority, Task } from "./types.js";

// A task with no explicit priority counts as "normal", so newly added tasks
// behave as normal without the reducer having to stamp the field.
const DEFAULT_PRIORITY: Priority = "normal";

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

export function taskPriority(task: Task): Priority {
  return task.priority ?? DEFAULT_PRIORITY;
}

export function remainingCount(state: AppState): number {
  return state.tasks.filter((task) => !task.done).length;
}
