import { describe, expect, it } from "vitest";
import { normalizeSpaces, slugify, truncate } from "./text.js";

describe("slugify", () => {
  it("lowercases and hyphenates a plain title", () => {
    expect(slugify("Buy Milk")).toBe("buy-milk");
  });

  it("collapses punctuation and extra spaces into single hyphens", () => {
    expect(slugify("  Write  Rules: Now!! ")).toBe("write-rules-now");
  });
});

describe("truncate", () => {
  it("returns the input unchanged when it already fits", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("keeps the result within maxLength, including the suffix", () => {
    const result = truncate("a long sentence here", 10, "...");
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result.endsWith("...")).toBe(true);
  });
});

describe("normalizeSpaces", () => {
  it("collapses internal whitespace and trims", () => {
    expect(normalizeSpaces("  a   b\tc ")).toBe("a b c");
  });
});
