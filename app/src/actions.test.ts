import { describe, expect, it } from "vitest";
import {
  addTask,
  clearTasks,
  removeTask,
  setFilter,
  setTaskPriority,
  toggleTask,
} from "./actions.js";

describe("action creators", () => {
  it("addTask builds a task/added action", () => {
    const action = addTask("a", "Buy milk");
    expect(action).toEqual({
      type: "task/added",
      payload: { id: "a", title: "Buy milk" },
    });
  });

  it("toggleTask builds a task/toggled action", () => {
    const action = toggleTask("a");
    expect(action).toEqual({
      type: "task/toggled",
      payload: { id: "a" },
    });
  });

  it("removeTask builds a task/removed action", () => {
    const action = removeTask("a");
    expect(action).toEqual({
      type: "task/removed",
      payload: { id: "a" },
    });
  });

  it("clearTasks builds a task/cleared action", () => {
    const action = clearTasks();
    expect(action).toEqual({ type: "task/cleared" });
  });

  it("clearTasks builds an equivalent action on repeated calls", () => {
    const first = clearTasks();
    const second = clearTasks();
    expect(second).toEqual(first);
  });

  it("setTaskPriority builds a task/prioritized action with the given id and priority", () => {
    const action = setTaskPriority("a", "high");
    expect(action).toEqual({
      type: "task/prioritized",
      payload: { id: "a", priority: "high" },
    });
  });

  it("setTaskPriority supports the low priority boundary value", () => {
    const action = setTaskPriority("a", "low");
    expect(action).toEqual({
      type: "task/prioritized",
      payload: { id: "a", priority: "low" },
    });
  });

  it("setFilter builds a filter/set action", () => {
    const action = setFilter("done");
    expect(action).toEqual({
      type: "filter/set",
      payload: { filter: "done" },
    });
  });
});
