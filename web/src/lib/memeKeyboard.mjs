/**
 * Keyboard action produced by the global meme shortcut resolver.
 *
 * @typedef {
 *   | "dismiss"
 *   | "toggle-help"
 *   | "previous"
 *   | "next"
 *   | "new-text"
 *   | "new-image"
 *   | "new-pairing"
 *   | "copy-image"
 *   | "download"
 * } MemeKeyboardAction
 */

/**
 * @param {{
 *   key: string;
 *   code: string;
 *   metaKey?: boolean;
 *   ctrlKey?: boolean;
 *   altKey?: boolean;
 * }} event
 * @param {{ editing: boolean; typing: boolean; usingControl: boolean }} context
 * @returns {MemeKeyboardAction | null}
 */
export function memeKeyboardAction(event, context) {
  const key = event.key.toLowerCase();
  const usingModifier = Boolean(event.metaKey || event.ctrlKey || event.altKey);

  if (event.key === "Escape") return context.editing ? null : "dismiss";
  if (context.editing || context.typing) return null;
  if (!usingModifier && (event.code === "Slash" || key === "?")) {
    return "toggle-help";
  }
  if (
    key === "c" &&
    (event.metaKey || event.ctrlKey) &&
    !event.altKey
  ) {
    return "copy-image";
  }
  if (usingModifier) return null;
  if (event.code === "Space") {
    return context.usingControl ? null : "new-pairing";
  }
  if (event.code === "ArrowRight" || key === "d") return "next";
  if (event.code === "ArrowLeft" || key === "a") return "previous";
  if (event.code === "ArrowDown" || key === "s") return "new-text";
  if (event.code === "Enter") {
    return context.usingControl ? null : "new-text";
  }
  if (event.code === "ArrowUp" || key === "w") return "new-image";
  if (key === "c") return "copy-image";
  if (key === "v") return "download";
  return null;
}
