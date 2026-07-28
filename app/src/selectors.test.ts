import { describe, expect, it } from "vitest";
import { taskPriority } from "./selectors.js";
import type { Task } from "./types.js";

describe("taskPriority", () => {
  it("defaults to normal when the field is absent", () => {
    // Arrange
    const task: Task = { id: "a", title: "A", done: false };
    // Act
    const priority = taskPriority(task);
    // Assert
    expect(priority).toBe("normal");
  });

  it("returns the explicit priority when present", () => {
    // Arrange
    const task: Task = { id: "a", title: "A", done: false, priority: "high" };
    // Act
    const priority = taskPriority(task);
    // Assert
    expect(priority).toBe("high");
  });
});
