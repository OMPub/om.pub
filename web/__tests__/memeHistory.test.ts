import { describe, expect, it } from "vitest";

import {
  appendSlideTimingDigit,
  nextLoopingHistoryIndex,
  normalizeSlideSeconds,
  removeHistoryEntry,
} from "../src/lib/memeHistory.mjs";

describe("meme history controls", () => {
  it("removes a middle entry and selects its predecessor", () => {
    expect(removeHistoryEntry(["a", "b", "c"], 1)).toEqual({
      history: ["a", "c"],
      index: 0,
      current: "a",
    });
  });

  it("selects the next remaining entry when the first is removed", () => {
    expect(removeHistoryEntry(["a", "b", "c"], 0)).toEqual({
      history: ["b", "c"],
      index: 0,
      current: "b",
    });
  });

  it("does not remove the only history entry", () => {
    expect(removeHistoryEntry(["a"], 0)).toBeNull();
  });

  it("loops through every history index", () => {
    expect(nextLoopingHistoryIndex(3, 0)).toBe(1);
    expect(nextLoopingHistoryIndex(3, 1)).toBe(2);
    expect(nextLoopingHistoryIndex(3, 2)).toBe(0);
  });

  it("normalizes slide timing to whole seconds", () => {
    expect(normalizeSlideSeconds("17")).toBe(17);
    expect(normalizeSlideSeconds("0")).toBe(1);
    expect(normalizeSlideSeconds("9999")).toBe(3600);
    expect(normalizeSlideSeconds("")).toBe(5);
  });

  it("collects a bounded sequence of timing digits", () => {
    expect(appendSlideTimingDigit("", "1")).toBe("1");
    expect(appendSlideTimingDigit("1", "7")).toBe("17");
    expect(appendSlideTimingDigit("1234", "5")).toBe("1234");
  });
});
