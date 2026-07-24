import { describe, expect, it } from "vitest";

import {
  compactTweetUrl,
  parseMemeSourceReference,
  tweetSyndicationToken,
} from "../src/lib/memeSourceUrl";

describe("parseMemeSourceReference", () => {
  it("recognizes x.com and twitter.com status URLs", () => {
    expect(
      parseMemeSourceReference(
        "https://x.com/punk6529/status/1539935358011543554?s=20",
      ),
    ).toEqual({ kind: "tweet", id: "1539935358011543554" });
    expect(
      parseMemeSourceReference(
        "https://mobile.twitter.com/punk6529/status/1449288790577664001",
      ),
    ).toEqual({ kind: "tweet", id: "1449288790577664001" });
  });

  it("accepts a URL without a protocol", () => {
    expect(
      parseMemeSourceReference(
        "x.com/punk6529/status/1469625474678767616",
      ),
    ).toEqual({ kind: "tweet", id: "1469625474678767616" });
  });

  it("round-trips the compact attribution URL", () => {
    const id = "1477259809493819393";
    expect(compactTweetUrl(id)).toBe(`x.com/i/status/${id}`);
    expect(parseMemeSourceReference(compactTweetUrl(id))).toEqual({
      kind: "tweet",
      id,
    });
  });

  it("recognizes 6529 wave and API drop URLs", () => {
    expect(
      parseMemeSourceReference(
        "https://6529.io/waves/62b0ac77-71e4-480f-a6ca-c3bb88a08ec1?drop=fa1c38f0-7f8a-4daf-94cf-f8a962503b56",
      ),
    ).toEqual({ kind: "drop", id: "fa1c38f0-7f8a-4daf-94cf-f8a962503b56" });
    expect(
      parseMemeSourceReference(
        "https://api.6529.io/api/drops/fa1c38f0-7f8a-4daf-94cf-f8a962503b56",
      ),
    ).toEqual({ kind: "drop", id: "fa1c38f0-7f8a-4daf-94cf-f8a962503b56" });
  });

  it("rejects malformed IDs and lookalike hosts", () => {
    expect(
      parseMemeSourceReference("https://x.com.evil.example/punk6529/status/123"),
    ).toBeNull();
    expect(
      parseMemeSourceReference("https://6529.io/?drop=not-a-drop-id"),
    ).toBeNull();
    expect(parseMemeSourceReference("definitely not a URL")).toBeNull();
  });
});

describe("tweetSyndicationToken", () => {
  it("generates the token expected by the public tweet endpoint", () => {
    expect(tweetSyndicationToken("1539935358011543554")).toBe("3qdul3aqo2");
  });
});
