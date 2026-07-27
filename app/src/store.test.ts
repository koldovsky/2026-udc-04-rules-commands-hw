import { describe, expect, it, vi } from "vitest";
import { createStore } from "./store.js";
import { addTask, setPriority, toggleTask } from "./actions.js";

describe("createStore", () => {
  it("starts from the initial state", () => {
    const store = createStore();
    expect(store.getState()).toEqual({ tasks: [], filter: "all" });
  });

  it("updates state only through dispatch", () => {
    const store = createStore();
    store.dispatch(addTask("a", "A"));
    expect(store.getState().tasks).toHaveLength(1);
  });

  it("changes task priority through dispatch", () => {
    const store = createStore();
    store.dispatch(addTask("a", "A"));
    store.dispatch(setPriority("a", "high"));
    expect(store.getState().tasks[0]?.priority).toBe("high");
  });

  it("notifies subscribers on every dispatch", () => {
    const store = createStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch(addTask("a", "A"));
    store.dispatch(toggleTask("a"));
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("stops notifying after unsubscribe", () => {
    const store = createStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.dispatch(addTask("a", "A"));
    expect(listener).not.toHaveBeenCalled();
  });
});
