

import { createStore } from "./store.js";
import { addTask, toggleTask, setFilter } from "./actions.js";
import { visibleTasks, remainingCount } from "./selectors.js";
import { slugify } from "./lib/text.js";

const store = createStore();

store.subscribe((state) => {
  console.log(
    `tasks: ${state.tasks.length}, remaining: ${remainingCount(state)}, filter: ${state.filter}`,
  );
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
