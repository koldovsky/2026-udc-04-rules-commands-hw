import { describe, expect, it } from "vitest";
import { reducer } from "./reducer.js";
import {
  addTask,
  removeTask,
  setFilter,
  setPriority,
  toggleTask,
} from "./actions.js";
import { initialState, type AppState } from "./types.js";

describe("reducer", () => {
  it("adds a task as not done with normal priority", () => {
    const next = reducer(initialState, addTask("buy-milk", "Buy Milk"));
    expect(next.tasks).toEqual([
      { id: "buy-milk", title: "Buy Milk", done: false, priority: "normal" },
    ]);
  });

  it("does not mutate the previous state (immutability)", () => {
    const next = reducer(initialState, addTask("a", "A"));
    expect(initialState.tasks).toEqual([]);
    expect(next).not.toBe(initialState);
  });

  it("toggles a task's done flag", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const toggled = reducer(withTask, toggleTask("a"));
    expect(toggled.tasks[0]?.done).toBe(true);
  });

  it("removes a task by id", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const removed = reducer(withTask, removeTask("a"));
    expect(removed.tasks).toEqual([]);
  });

  it("sets a task's priority immutably", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const prioritized = reducer(withTask, setPriority("a", "high"));
    expect(prioritized.tasks[0]?.priority).toBe("high");
    expect(prioritized).not.toBe(withTask);
    expect(withTask.tasks[0]?.priority).toBe("normal");
  });

  it("sets the filter", () => {
    const next = reducer(initialState, setFilter("done"));
    expect(next.filter).toBe("done");
  });

  it("returns the same state for an unknown id toggle", () => {
    const state: AppState = {
      tasks: [{ id: "a", title: "A", done: false, priority: "normal" }],
      filter: "all",
    };
    const next = reducer(state, toggleTask("missing"));
    expect(next.tasks[0]?.done).toBe(false);
  });
});
