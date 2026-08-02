import { describe, expect, it } from "vitest";

import { memeKeyboardAction } from "../src/lib/memeKeyboard.mjs";

const idle = { editing: false, typing: false, usingControl: false };

function key(
  keyValue: string,
  code = `Key${keyValue.toUpperCase()}`,
  modifiers: Partial<{
    metaKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
  }> = {},
) {
  return { key: keyValue, code, ...modifiers };
}

describe("meme keyboard shortcuts", () => {
  it.each([
    [key("a"), "previous"],
    [key("ArrowLeft", "ArrowLeft"), "previous"],
    [key("d"), "next"],
    [key("ArrowRight", "ArrowRight"), "next"],
    [key("s"), "new-text"],
    [key("ArrowDown", "ArrowDown"), "new-text"],
    [key("Enter", "Enter"), "new-pairing"],
    [key("w"), "new-image"],
    [key("ArrowUp", "ArrowUp"), "new-image"],
    [key(" ", "Space"), "toggle-slideshow"],
    [key("c"), "copy-image"],
    [key("c", "KeyC", { metaKey: true }), "copy-image"],
    [key("c", "KeyC", { ctrlKey: true }), "copy-image"],
    [key("v"), "download"],
    [key("l"), "copy-link"],
    [key("k"), "copy-image-link"],
    [key("i"), "toggle-info"],
    [key("m"), "toggle-menu"],
    [key("p"), "focus-source"],
    [key("Delete", "Delete"), "delete-history"],
    [key("Backspace", "Backspace"), "delete-history"],
    [key("1", "Digit1"), "slide-digit:1"],
    [key("7", "Numpad7"), "slide-digit:7"],
    [key("/", "Slash"), "toggle-help"],
    [key("?", "Slash"), "toggle-help"],
    [key("Escape", "Escape"), "dismiss"],
  ])("maps %o to %s", (event, action) => {
    expect(memeKeyboardAction(event, idle)).toBe(action);
  });

  it.each([
    [key("a"), "previous"],
    [key("d"), "next"],
    [key("s"), "new-text"],
    [key("w"), "new-image"],
    [key("c"), "copy-image"],
    [key("v"), "download"],
    [key(" ", "Space"), "toggle-slideshow"],
    [key("ArrowLeft", "ArrowLeft"), "previous"],
    [key("ArrowRight", "ArrowRight"), "next"],
  ])("keeps %o global when a control has focus", (event, action) => {
    expect(memeKeyboardAction(event, { ...idle, usingControl: true })).toBe(
      action,
    );
  });

  it("preserves native Enter behavior on controls", () => {
    const control = { ...idle, usingControl: true };

    expect(memeKeyboardAction(key("Enter", "Enter"), control)).toBeNull();
  });

  it("leaves shortcuts alone while editing or typing", () => {
    expect(memeKeyboardAction(key("d"), { ...idle, editing: true })).toBeNull();
    expect(memeKeyboardAction(key("c", "KeyC", { metaKey: true }), {
      ...idle,
      editing: true,
    })).toBeNull();
    expect(memeKeyboardAction(key("v"), { ...idle, typing: true })).toBeNull();
    expect(memeKeyboardAction(key("Escape", "Escape"), {
      ...idle,
      editing: true,
    })).toBeNull();
    expect(memeKeyboardAction(key("Escape", "Escape"), {
      ...idle,
      typing: true,
    })).toBe("dismiss");
  });

  it.each([
    key("d", "KeyD", { metaKey: true }),
    key("s", "KeyS", { ctrlKey: true }),
    key("w", "KeyW", { altKey: true }),
    key("ArrowLeft", "ArrowLeft", { metaKey: true }),
    key("v", "KeyV", { metaKey: true }),
    key(" ", "Space", { ctrlKey: true }),
    key("1", "Digit1", { metaKey: true }),
    key("Backspace", "Backspace", { ctrlKey: true }),
    key("l", "KeyL", { metaKey: true }),
  ])("does not intercept modified browser shortcuts: %o", (event) => {
    expect(memeKeyboardAction(event, idle)).toBeNull();
  });
});
