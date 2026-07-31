import { describe, expect, it } from "vitest";

import {
  boostCountsById,
  boostSelectionWeight,
  mergeBoostedDropQueue,
  newlyBoostedDrops,
  pickBoostWeightedSource,
} from "../src/lib/boostedDropSelection";
import type { MemeShareSource } from "../src/lib/memeShare";

function drop(id: string, boosts: number): MemeShareSource {
  return {
    kind: "drop",
    id,
    content: `Drop ${id}`,
    authorHandle: "6529",
    url: `https://6529.io/?drop=${id}`,
    label: "6529",
    engagement: {
      count: boosts,
      type: "boosts",
    },
  };
}

describe("boosted drop selection", () => {
  it("uses linear boost-count weighting", () => {
    expect(boostSelectionWeight(drop("one", 1))).toBe(1);
    expect(boostSelectionWeight(drop("nine", 9))).toBe(9);
  });

  it("uses boost weights when choosing a random drop", () => {
    const sources = [drop("one", 1), drop("nine", 9)];

    expect(pickBoostWeightedSource(sources, () => 0.09).id).toBe("one");
    expect(pickBoostWeightedSource(sources, () => 0.1).id).toBe("nine");
    expect(pickBoostWeightedSource(sources, () => 0.99).id).toBe("nine");
  });

  it("finds every new or newly re-boosted drop in API order", () => {
    const previous = boostCountsById([
      drop("unchanged", 2),
      drop("boosted", 3),
    ]);
    const latest = [
      drop("new", 1),
      drop("boosted", 4),
      drop("unchanged", 2),
    ];

    expect(newlyBoostedDrops(previous, latest).map((source) => source.id))
      .toEqual(["new", "boosted"]);
  });

  it("keeps queue order, refreshes metadata, and appends unseen drops", () => {
    const queued = [drop("first", 1), drop("second", 1)];
    const merged = mergeBoostedDropQueue(queued, [
      drop("second", 3),
      drop("third", 2),
    ]);

    expect(merged.map((source) => source.id))
      .toEqual(["first", "second", "third"]);
    expect(merged[1].engagement?.count).toBe(3);
  });
});
