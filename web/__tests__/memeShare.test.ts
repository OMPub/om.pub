import { describe, expect, it } from "vitest";

import {
  createStandaloneMemeShareUrl,
  createMemeShareUrl,
  DEFAULT_STANDALONE_MEME_URL,
  decodeMemeShare,
  MEME_SHARE_QUERY_KEY,
  type MemeSharePayload,
} from "../src/lib/memeShare";

const payload: MemeSharePayload = {
  version: 1,
  reactionFile: "reaction-164.webp",
  source: {
    kind: "tweet",
    id: "1443921334837338114",
    content: "However bullish you are on NFTs, you are wrong.",
    authorHandle: "punk6529",
    url: "https://x.com/i/status/1443921334837338114",
    label: "tweet",
    preferredCaption: {
      top: "However bullish you are on NFTs,",
      bottom: "you are wrong.",
    },
    engagement: {
      count: 12243,
      type: "likes",
    },
  },
  topText: "However bullish 🚀\nstill bullish",
  bottomText: "YOU ARE WRONG.",
  attributionVisible: false,
};

describe("meme share URLs", () => {
  it("round-trips the exact image, captions, and source metadata", () => {
    const value = JSON.stringify(payload);
    expect(decodeMemeShare(value)).toEqual(payload);
  });

  it("round-trips a wave drop source", () => {
    const dropPayload: MemeSharePayload = {
      ...payload,
      source: {
        kind: "drop",
        id: "fa1c38f0-7f8a-4daf-94cf-f8a962503b56",
        content: "Great to hear friend!",
        authorHandle: "AshtonTekno",
        url: "https://6529.io/waves/62b0ac77-71e4-480f-a6ca-c3bb88a08ec1?drop=fa1c38f0-7f8a-4daf-94cf-f8a962503b56",
        label: "Forever Frozen",
        engagement: {
          count: 1,
          type: "boosts",
        },
      },
    };

    expect(decodeMemeShare(JSON.stringify(dropPayload))).toEqual(dropPayload);
  });

  it("creates a self-contained URL without retaining unrelated query data", () => {
    const shareUrl = createMemeShareUrl(
      "https://om.pub/memes/boosted?old=value#section",
      payload,
    );
    const url = new URL(shareUrl);

    expect(url.pathname).toBe("/memes/boosted");
    expect(url.hash).toBe("");
    expect(Array.from(url.searchParams.keys())).toEqual([
      MEME_SHARE_QUERY_KEY,
    ]);
    expect(decodeMemeShare(url.searchParams.get(MEME_SHARE_QUERY_KEY))).toEqual(
      payload,
    );
  });

  it("targets the single-file page for portable copy links", () => {
    const shareUrl = createStandaloneMemeShareUrl(payload);
    const url = new URL(shareUrl);

    expect(url.origin + url.pathname).toBe(DEFAULT_STANDALONE_MEME_URL);
    expect(decodeMemeShare(url.searchParams.get(MEME_SHARE_QUERY_KEY))).toEqual(
      payload,
    );
  });

  it("can switch copied links to an Arweave transaction URL", () => {
    const shareUrl = createStandaloneMemeShareUrl(
      payload,
      "https://arweave.net/example-transaction?ignored=yes",
    );
    const url = new URL(shareUrl);

    expect(url.origin + url.pathname).toBe(
      "https://arweave.net/example-transaction",
    );
    expect(Array.from(url.searchParams.keys())).toEqual([
      MEME_SHARE_QUERY_KEY,
    ]);
  });

  it("rejects unsafe source links and unknown image files", () => {
    expect(decodeMemeShare(JSON.stringify({
      ...payload,
      source: {
        ...payload.source,
        url: "javascript:alert(1)",
      },
    }))).toBeNull();
    expect(decodeMemeShare(JSON.stringify({
      ...payload,
      source: {
        ...payload.source,
        url: "x.com/i/status/1443921334837338114",
      },
    }))).toBeNull();
    expect(decodeMemeShare(JSON.stringify({
      ...payload,
      reactionFile: "../../secret.webp",
    }))).toBeNull();
  });
});
