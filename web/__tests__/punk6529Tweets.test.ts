import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

type CuratedTweet = {
  id: string;
  text: string;
  topText: string;
  bottomText: string;
  likes: number;
};

const corpus = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "public/boosted-reactions/punk6529-tweets.json"),
    "utf8",
  ),
) as { tweets: CuratedTweet[] };

describe("curated Punk6529 tweet captions", () => {
  it("stores an explicit, lossless top and bottom caption for every tweet", () => {
    expect(corpus.tweets).toHaveLength(50);
    expect(new Set(corpus.tweets.map((tweet) => tweet.id)).size).toBe(50);

    for (const tweet of corpus.tweets) {
      expect(tweet.topText.trim()).not.toBe("");
      expect(tweet.bottomText.trim()).not.toBe("");
      expect(`${tweet.topText} ${tweet.bottomText}`).toBe(tweet.text);
    }
  });

  it("preserves the curated setup and payoff instead of a midpoint split", () => {
    const survive = corpus.tweets.find(
      (tweet) => tweet.id === "1477259809493819393",
    );
    const bullish = corpus.tweets.find(
      (tweet) => tweet.id === "1443921334837338114",
    );

    expect(survive).toMatchObject({
      topText: "There is one rule only:",
      bottomText: "SURVIVE!",
    });
    expect(bullish).toMatchObject({
      topText: "However bullish you are on NFTs, you are wrong.",
      bottomText: "You are insufficiently bullish.",
    });
  });
});
