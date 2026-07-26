// Example wiring of the store. Run/adapt this to see the architecture in
// action. It is intentionally tiny — the point of this repo is the RULES you
// write around this code, not the app itself.

import { createStore } from "./store.js";
import { addTask, toggleTask, setFilter, setTaskPriority } from "./actions.js";
import { visibleTasks, remainingCount, taskPriority } from "./selectors.js";
import { slugify } from "./lib/text.js";

const store = createStore();

store.subscribe((state) => {
  console.log(
    `tasks: ${state.tasks.length}, remaining: ${remainingCount(state)}, filter: ${state.filter}`,
  );
});

const buyMilk = slugify("Buy Milk");
const writeRules = slugify("Write rules");
store.dispatch(addTask(buyMilk, "Buy Milk"));
store.dispatch(addTask(writeRules, "Write rules"));
store.dispatch(toggleTask(buyMilk));
store.dispatch(setTaskPriority(writeRules, "high"));
store.dispatch(setFilter("active"));

console.log(
  "visible:",
  visibleTasks(store.getState()).map((task) => `${task.title} (${taskPriority(task)})`),
);
