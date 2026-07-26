import { describe, expect, it } from "vitest";
import { reducer } from "./reducer.js";
import { addTask, removeTask, setFilter, setTaskPriority, toggleTask } from "./actions.js";
import { initialState, type AppState } from "./types.js";

describe("reducer", () => {
  it("adds a task as not done", () => {
    const next = reducer(initialState, addTask("buy-milk", "Buy Milk"));
    expect(next.tasks).toEqual([{ id: "buy-milk", title: "Buy Milk", done: false }]);
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
    const state: AppState = { tasks: [{ id: "a", title: "A", done: false }], filter: "all" };
    const next = reducer(state, toggleTask("missing"));
    expect(next.tasks[0]?.done).toBe(false);
  });

  it("sets a task's priority", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const prioritized = reducer(withTask, setTaskPriority("a", "high"));
    expect(prioritized.tasks[0]?.priority).toBe("high");
  });

  it("does not mutate the previous state when setting priority", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const prioritized = reducer(withTask, setTaskPriority("a", "low"));
    expect(withTask.tasks[0]?.priority).toBeUndefined();
    expect(prioritized.tasks[0]).not.toBe(withTask.tasks[0]);
  });

  it("returns the same state for an unknown id priority change", () => {
    const state: AppState = { tasks: [{ id: "a", title: "A", done: false }], filter: "all" };
    const next = reducer(state, setTaskPriority("missing", "high"));
    expect(next.tasks[0]?.priority).toBeUndefined();
  });
});
