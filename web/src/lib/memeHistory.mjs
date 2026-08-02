export const DEFAULT_SLIDE_SECONDS = 5;
export const MAX_SLIDE_SECONDS = 3600;

/**
 * @template T
 * @param {T[]} history
 * @param {number} index
 * @returns {{ history: T[]; index: number; current: T } | null}
 */
export function removeHistoryEntry(history, index) {
  if (history.length <= 1 || index < 0 || index >= history.length) return null;
  const nextHistory = history.slice();
  nextHistory.splice(index, 1);
  const nextIndex = index > 0 ? index - 1 : 0;
  return {
    history: nextHistory,
    index: nextIndex,
    current: nextHistory[nextIndex],
  };
}

export function nextLoopingHistoryIndex(length, index) {
  if (length < 1) return -1;
  return (Math.max(-1, index) + 1) % length;
}

export function normalizeSlideSeconds(
  value,
  fallback = 5,
) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(3600, Math.max(1, parsed));
}

export function appendSlideTimingDigit(buffer, digit) {
  if (!/^\d$/.test(digit)) return buffer;
  return `${buffer}${digit}`.slice(0, 4);
}
