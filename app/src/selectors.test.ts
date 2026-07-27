import { describe, expect, it } from "vitest";
import { currentFilter, taskCount } from "./selectors.js";
import { initialState, type AppState } from "./types.js";

describe("taskCount", () => {
  it("counts the tasks in state", () => {
    const state: AppState = {
      tasks: [
        { id: "a", title: "A", done: false, priority: "normal" },
        { id: "b", title: "B", done: true, priority: "high" },
      ],
      filter: "all",
    };
    const count = taskCount(state);
    expect(count).toBe(2);
  });

  it("returns 0 for an empty task list", () => {
    const count = taskCount(initialState);
    expect(count).toBe(0);
  });
});

describe("currentFilter", () => {
  it("returns the state's filter", () => {
    const state: AppState = { tasks: [], filter: "done" };
    const filter = currentFilter(state);
    expect(filter).toBe("done");
  });

  it("reflects the default filter on initial state", () => {
    const filter = currentFilter(initialState);
    expect(filter).toBe("all");
  });
});