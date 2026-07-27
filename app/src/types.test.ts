import { describe, expect, it } from "vitest";
import { initialState, type Priority, type Task } from "./types.js";

describe("Priority", () => {
  it("accepts exactly low, normal, and high", () => {
    const priorities: Priority[] = ["low", "normal", "high"];
    expect(priorities).toEqual(["low", "normal", "high"]);
  });
});

describe("Task", () => {
  it("requires id, title, done, and priority", () => {
    const task: Task = { id: "a", title: "A", done: false, priority: "normal" };
    expect(task).toEqual({ id: "a", title: "A", done: false, priority: "normal" });
  });
});

describe("initialState", () => {
  it("starts with no tasks and the 'all' filter", () => {
    expect(initialState).toEqual({ tasks: [], filter: "all" });
  });
});
