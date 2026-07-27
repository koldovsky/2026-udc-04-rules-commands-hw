// Example wiring of the store. Run/adapt this to see the architecture in
// action. It is intentionally tiny — the point of this repo is the RULES you
// write around this code, not the app itself.

import { createStore } from "./store.js";
import { addTask, toggleTask, setFilter } from "./actions.js";
import {
  visibleTasks,
  remainingCount,
  taskCount,
  currentFilter,
} from "./selectors.js";
import { slugify } from "./lib/text.js";
import type { AppState } from "./types.js";

export function formatStatus(state: AppState): string {
  return `tasks: ${taskCount(state)}, remaining: ${remainingCount(state)}, filter: ${currentFilter(state)}`;
}

const store = createStore();

store.subscribe((state) => {
  console.log(formatStatus(state));
});

const buyMilk = slugify("Buy Milk");
store.dispatch(addTask(buyMilk, "Buy Milk"));
store.dispatch(addTask(slugify("Write rules"), "Write rules"));
store.dispatch(toggleTask(buyMilk));
store.dispatch(setFilter("active"));

console.log(
  "visible:",
  visibleTasks(store.getState()).map((task) => task.title),
);
