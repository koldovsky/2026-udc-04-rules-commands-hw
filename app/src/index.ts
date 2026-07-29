// Example wiring of the store. Run/adapt this to see the architecture in
// action. It is intentionally tiny — the point of this repo is the RULES you
// write around this code, not the app itself.

import type { Store } from "./store.js";
import { createStore } from "./store.js";
import { addTask, toggleTask, setFilter } from "./actions.js";
import { visibleTasks, remainingCount } from "./selectors.js";
import { slugify } from "./lib/text.js";
import type { TaskId } from "./types.js";

const store = createStore();

store.subscribe((state) => {
  console.log(
    `tasks: ${state.tasks.length}, remaining: ${remainingCount(state)}, filter: ${state.filter}`,
  );
});

// The id is derived from the title, so the two must be written once, not twice
// — passing a hand-typed slug that drifts from its title is the easy mistake.
function addTaskByTitle(target: Store, title: string): TaskId {
  const id = slugify(title);
  target.dispatch(addTask(id, title));
  return id;
}

const buyMilk = addTaskByTitle(store, "Buy Milk");
addTaskByTitle(store, "Write rules");
store.dispatch(toggleTask(buyMilk));
store.dispatch(setFilter("active"));

console.log(
  "visible:",
  visibleTasks(store.getState()).map((task) => task.title),
);
