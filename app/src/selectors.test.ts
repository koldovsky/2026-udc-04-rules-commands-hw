import { describe, expect, it } from "vitest";
import { reducer } from "./reducer.js";
import { addTask, setTaskPriority } from "./actions.js";
import { taskPriority } from "./selectors.js";
import { initialState } from "./types.js";

describe("taskPriority", () => {
  it("treats a newly added task as normal", () => {
    const task = reducer(initialState, addTask("a", "A")).tasks[0];
    expect(task && taskPriority(task)).toBe("normal");
  });

  it("reports an explicitly set priority", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const task = reducer(withTask, setTaskPriority("a", "high")).tasks[0];
    expect(task && taskPriority(task)).toBe("high");
  });
});
