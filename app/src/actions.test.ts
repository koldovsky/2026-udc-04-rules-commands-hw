import { describe, expect, it } from "vitest";
import { clearCompleted, setTaskPriority } from "./actions.js";

describe("action creators", () => {
  it("creates a clear completed action", () => {
    expect(clearCompleted()).toEqual({ type: "task/cleared" });
  });

  it("creates a set task priority action", () => {
    expect(setTaskPriority("task-1", "high")).toEqual({
      type: "task/priority-set",
      payload: { id: "task-1", priority: "high" },
    });
  });
});
