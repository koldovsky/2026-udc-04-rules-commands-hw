import { describe, expect, it } from "vitest";
import { addTask, removeTask, setFilter, setPriority, toggleTask } from "./actions.js";

describe("addTask", () => {
  it("builds a task/added action with the given id and title", () => {
    expect(addTask("a", "A")).toEqual({
      type: "task/added",
      payload: { id: "a", title: "A" },
    });
  });
});

describe("toggleTask", () => {
  it("builds a task/toggled action with the given id", () => {
    expect(toggleTask("a")).toEqual({
      type: "task/toggled",
      payload: { id: "a" },
    });
  });
});

describe("removeTask", () => {
  it("builds a task/removed action with the given id", () => {
    expect(removeTask("a")).toEqual({
      type: "task/removed",
      payload: { id: "a" },
    });
  });
});

describe("setFilter", () => {
  it("builds a filter/set action with the given filter", () => {
    expect(setFilter("done")).toEqual({
      type: "filter/set",
      payload: { filter: "done" },
    });
  });
});

describe("setPriority", () => {
  it("builds a task/priority-set action with the given id and priority", () => {
    // Arrange
    const id = "a";
    const priority = "high";

    // Act
    const action = setPriority(id, priority);

    // Assert
    expect(action).toEqual({
      type: "task/priority-set",
      payload: { id: "a", priority: "high" },
    });
  });
});
