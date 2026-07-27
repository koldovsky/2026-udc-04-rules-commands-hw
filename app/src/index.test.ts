import { describe, expect, it } from "vitest";
import { formatStatus } from "./index.js";
import { initialState, type AppState } from "./types.js";

describe("formatStatus", () => {
  it("formats task count, remaining count, and filter", () => {
    const state: AppState = {
      tasks: [
        { id: "a", title: "A", done: false, priority: "normal" },
        { id: "b", title: "B", done: true, priority: "high" },
      ],
      filter: "active",
    };
    const formatted = formatStatus(state);
    expect(formatted).toBe("tasks: 2, remaining: 1, filter: active");
  });

  it("formats the initial (empty) state", () => {
    const formatted = formatStatus(initialState);
    expect(formatted).toBe("tasks: 0, remaining: 0, filter: all");
  });
});