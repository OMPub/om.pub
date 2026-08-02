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
 *   | "toggle-slideshow"
 *   | "delete-history"
 *   | "copy-image"
 *   | "copy-link"
 *   | "copy-image-link"
 *   | "download"
 *   | "toggle-info"
 *   | "toggle-menu"
 *   | "focus-source"
 *   | `slide-digit:${number}`
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
  if (!usingModifier && /^\d$/.test(key)) return `slide-digit:${key}`;
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
  if (event.code === "Space") return "toggle-slideshow";
  if (event.code === "ArrowRight" || key === "d") return "next";
  if (event.code === "ArrowLeft" || key === "a") return "previous";
  if (event.code === "ArrowDown" || key === "s") return "new-text";
  if (event.code === "Enter") {
    return context.usingControl ? null : "new-pairing";
  }
  if (event.code === "ArrowUp" || key === "w") return "new-image";
  if (event.code === "Delete" || event.code === "Backspace") {
    return "delete-history";
  }
  if (key === "c") return "copy-image";
  if (key === "v") return "download";
  if (key === "l") return "copy-link";
  if (key === "k") return "copy-image-link";
  if (key === "i") return "toggle-info";
  if (key === "m") return "toggle-menu";
  if (key === "p") return "focus-source";
  return null;
}
