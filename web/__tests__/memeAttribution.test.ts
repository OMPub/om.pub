import { describe, expect, it } from "vitest";

import { sourceAttribution } from "../src/lib/memeAttribution";

describe("sourceAttribution", () => {
  it("uses an OCR-readable compact permalink for tweets", () => {
    expect(sourceAttribution({
      kind: "tweet",
      id: "1443921334837338114",
      authorHandle: "punk6529",
      label: "tweet",
      engagement: { count: 12243, type: "likes" },
    })).toEqual({
      parts: [
        "@punk6529",
        "x.com/i/status/1443921334837338114",
        "12,243 likes",
      ],
      text: "@punk6529  ·  x.com/i/status/1443921334837338114  ·  12,243 likes",
    });
  });

  it("keeps drop attribution labels unchanged", () => {
    expect(sourceAttribution({
      kind: "drop",
      id: "drop-id",
      authorHandle: "artist",
      label: "Meme Card",
      engagement: { count: 1, type: "boosts" },
    }).parts).toEqual(["@artist", "Meme Card", "1 boost"]);
  });
});
