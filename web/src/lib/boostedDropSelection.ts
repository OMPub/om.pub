import type { MemeShareSource } from "@/lib/memeShare";

function secureRandomFraction() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] / 2 ** 32;
}

export function boostSelectionWeight(source: MemeShareSource) {
  if (
    source.kind !== "drop" ||
    source.engagement?.type !== "boosts"
  ) {
    return 1;
  }
  return Math.max(1, source.engagement.count);
}

export function pickBoostWeightedSource(
  sources: MemeShareSource[],
  random = secureRandomFraction,
) {
  if (!sources.length) {
    throw new Error("Cannot pick from an empty source pool");
  }
  const weights = sources.map(boostSelectionWeight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const fraction = Math.min(
    Math.max(random(), 0),
    1 - Number.EPSILON,
  );
  const target = fraction * total;
  let cumulative = 0;
  for (let index = 0; index < sources.length; index += 1) {
    cumulative += weights[index];
    if (target < cumulative) return sources[index];
  }
  return sources[sources.length - 1];
}

export function boostCountsById(sources: MemeShareSource[]) {
  return new Map(
    sources
      .filter(
        (source) =>
          source.kind === "drop" &&
          source.engagement?.type === "boosts",
      )
      .map((source) => [source.id, source.engagement?.count ?? 0]),
  );
}

export function newlyBoostedDrops(
  previousCounts: ReadonlyMap<string, number>,
  latestSources: MemeShareSource[],
) {
  return latestSources.filter((source) => {
    if (
      source.kind !== "drop" ||
      source.engagement?.type !== "boosts"
    ) {
      return false;
    }
    return source.engagement.count > (previousCounts.get(source.id) ?? 0);
  });
}

export function mergeBoostedDropQueue(
  queuedSources: MemeShareSource[],
  newlyBoostedSources: MemeShareSource[],
) {
  const latestById = new Map(
    newlyBoostedSources.map((source) => [source.id, source]),
  );
  const merged = queuedSources.map(
    (source) => latestById.get(source.id) ?? source,
  );
  const queuedIds = new Set(queuedSources.map((source) => source.id));
  for (const source of newlyBoostedSources) {
    if (!queuedIds.has(source.id)) {
      merged.push(source);
      queuedIds.add(source.id);
    }
  }
  return merged;
}
