// @vitest-environment node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { renderMemeImageResponse } from "../src/pages/api/booster/image.png";
import {
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
    engagement: { count: 12243, type: "likes" },
  },
  topText: "However bullish you are on NFTs,",
  bottomText: "you are wrong.",
  attributionVisible: true,
};

function imageRequestUrl(base?: string) {
  const url = new URL("https://om.pub/booster/image.png");
  url.searchParams.set(MEME_SHARE_QUERY_KEY, JSON.stringify(payload));
  if (base) url.searchParams.set("b", base);
  return url;
}

afterEach(() => vi.unstubAllGlobals());

describe("booster image route", () => {
  it("redirects browser navigation to the exact editable app state", async () => {
    const response = await renderMemeImageResponse(
      imageRequestUrl("https://arweave.net/example-transaction"),
      "text/html,application/xhtml+xml",
    );
    const location = new URL(response.headers.get("location")!);

    expect(response.status).toBe(307);
    expect(location.origin + location.pathname).toBe(
      "https://arweave.net/example-transaction",
    );
    expect(location.searchParams.get(MEME_SHARE_QUERY_KEY)).toBe(
      JSON.stringify(payload),
    );
  });

  it("ignores an unsafe click-through destination", async () => {
    const response = await renderMemeImageResponse(
      imageRequestUrl("https://example.com/phishing"),
      "text/html",
    );
    const location = new URL(response.headers.get("location")!);

    expect(location.origin + location.pathname).toBe("https://om.pub/booster");
    expect(location.searchParams.get(MEME_SHARE_QUERY_KEY)).toBe(
      JSON.stringify(payload),
    );
  });

  it("renders image requests as real PNG bytes", async () => {
    const artwork = await readFile(resolve(
      "public/boosted-reactions/renderer/reaction-164.jpg",
    ));
    const originalFetch = globalThis.fetch;
    vi.stubGlobal("fetch", vi.fn(async (
      input: string | URL | Request,
      init?: RequestInit,
    ) => String(input).includes("reaction-164.jpg")
      ? new Response(artwork, {
        status: 200,
        headers: { "Content-Type": "image/jpeg" },
      })
      : originalFetch(input, init)));

    const response = await renderMemeImageResponse(
      imageRequestUrl(),
      "image/avif,image/webp,image/png,image/*,*/*;q=.8",
    );
    const bytes = new Uint8Array(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("vary")).toBe("Accept");
    expect(Array.from(bytes.slice(0, 8))).toEqual([
      137, 80, 78, 71, 13, 10, 26, 10,
    ]);
    expect(bytes.byteLength).toBeGreaterThan(100_000);
  });
});
