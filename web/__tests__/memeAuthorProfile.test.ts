import { describe, expect, it } from "vitest";

import {
  normalizeProfileImageUrl,
  parseMemeAuthorProfile,
} from "../src/lib/memeAuthorProfile";

describe("meme author profiles", () => {
  it("normalizes public HTTPS and IPFS profile images", () => {
    expect(normalizeProfileImageUrl("ipfs://QmProfile/image.webp"))
      .toBe("https://ipfs.io/ipfs/QmProfile/image.webp");
    expect(normalizeProfileImageUrl("https://cdn.example/profile.webp"))
      .toBe("https://cdn.example/profile.webp");
    expect(normalizeProfileImageUrl("javascript:alert(1)")).toBe("");
  });

  it("parses identity metrics and the top five incoming REP categories", () => {
    const profile = parseMemeAuthorProfile(
      {
        handle: "punk6529",
        level: 100,
        tdh: 76_398_038,
        rep: 4_755_878,
        pfp: "https://cdn.example/punk.webp",
        banner1: "#211b23",
        banner2: "#5cbbc7",
      },
      {
        data: Array.from({ length: 6 }, (_, index) => ({
          category: `Category ${index + 1}`,
          total_rep: 600 - index * 100,
        })),
      },
    );

    expect(profile).toMatchObject({
      handle: "punk6529",
      level: 100,
      tdh: 76_398_038,
      rep: 4_755_878,
      banner1: "#211b23",
      banner2: "#5cbbc7",
    });
    expect(profile?.topRep).toHaveLength(5);
    expect(profile?.topRep[0]).toEqual({
      category: "Category 1",
      totalRep: 600,
    });
  });

  it("rejects malformed profiles and unsafe banner values", () => {
    expect(parseMemeAuthorProfile({}, { data: [] })).toBeNull();
    expect(parseMemeAuthorProfile(
      {
        handle: "6529",
        banner1: "url(https://example.com/image)",
        banner2: "#ffffff",
      },
      { data: [] },
    )).toMatchObject({
      banner1: "#24343b",
      banner2: "#ffffff",
    });
  });
});
