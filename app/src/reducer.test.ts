import { describe, expect, it } from "vitest";
import { reducer } from "./reducer.js";
import { addTask, removeTask, renameTask, setFilter, setPriority, toggleTask } from "./actions.js";
import { initialState, type AppState } from "./types.js";

describe("reducer", () => {
  it("adds a task as not done with normal priority", () => {
    const next = reducer(initialState, addTask("buy-milk", "Buy Milk"));
    expect(next.tasks).toEqual([{ id: "buy-milk", title: "Buy Milk", done: false, priority: "normal" }]);
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
    const state: AppState = { tasks: [{ id: "a", title: "A", done: false, priority: "normal" }], filter: "all" };
    const next = reducer(state, toggleTask("missing"));
    expect(next.tasks[0]?.done).toBe(false);
  });

  it("renames a task by id", () => {
    // Arrange
    const withTask = reducer(initialState, addTask("a", "A"));
    // Act
    const renamed = reducer(withTask, renameTask("a", "A renamed"));
    // Assert
    expect(renamed.tasks[0]?.title).toBe("A renamed");
    expect(renamed.tasks[0]?.done).toBe(false);
  });

  it("does not mutate the previous state when renaming", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const renamed = reducer(withTask, renameTask("a", "A renamed"));
    expect(renamed).not.toBe(withTask);
    expect(withTask.tasks[0]?.title).toBe("A");
  });

  it("leaves tasks unchanged when renaming an unknown id", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const renamed = reducer(withTask, renameTask("missing", "Nope"));
    expect(renamed.tasks).toEqual(withTask.tasks);
  });

  it("changes a task's priority", () => {
    // Arrange
    const withTask = reducer(initialState, addTask("a", "A"));
    // Act
    const reprioritized = reducer(withTask, setPriority("a", "high"));
    // Assert
    expect(reprioritized.tasks[0]?.priority).toBe("high");
  });

  it("does not mutate the previous state when changing priority", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const reprioritized = reducer(withTask, setPriority("a", "low"));
    expect(reprioritized).not.toBe(withTask);
    expect(withTask.tasks[0]?.priority).toBe("normal");
  });

  it("leaves tasks unchanged when prioritizing an unknown id", () => {
    const withTask = reducer(initialState, addTask("a", "A"));
    const reprioritized = reducer(withTask, setPriority("missing", "high"));
    expect(reprioritized.tasks).toEqual(withTask.tasks);
  });
});
