import { describe, expect, it } from "vitest";
import { reducer } from "./reducer.js";
import { addTask, removeTask, setFilter, setPriority, toggleTask } from "./actions.js";
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

  it("sets a task's priority", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const prioritized = reducer(withTask, setPriority("a", "high"));
    expect(prioritized.tasks[0]?.priority).toBe("high");
  });

  it("leaves other tasks untouched when setting a priority", () => {
    const withTasks = reducer(
      reducer(initialState, addTask("a", "A")),
      addTask("b", "B"),
    );
    const prioritized = reducer(withTasks, setPriority("a", "low"));
    expect(prioritized.tasks[1]?.priority).toBe("normal");
  });

  it("does not mutate the previous state when setting a priority", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const prioritized = reducer(withTask, setPriority("a", "high"));
    expect(withTask.tasks[0]?.priority).toBe("normal");
    expect(prioritized.tasks[0]).not.toBe(withTask.tasks[0]);
  });

  it("returns tasks unchanged for an unknown id priority change", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const next = reducer(withTask, setPriority("missing", "high"));
    expect(next.tasks[0]?.priority).toBe("normal");
  });
});
