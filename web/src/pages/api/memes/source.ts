import type { NextApiRequest, NextApiResponse } from "next";

import {
  compactTweetUrl,
  parseMemeSourceReference,
  tweetSyndicationToken,
} from "@/lib/memeSourceUrl";

type CaptionSource = {
  kind: "drop" | "tweet";
  id: string;
  content: string;
  authorHandle: string;
  url: string;
  label: string;
  engagement?: {
    count: number;
    type: "boosts" | "likes";
  };
};

type ErrorResponse = {
  error: string;
};

type TweetResult = {
  favorite_count?: number;
  id_str?: string;
  text?: string;
  user?: {
    screen_name?: string;
  };
};

type DropResult = {
  id?: string;
  boosts?: number;
  author?: {
    handle?: string;
  };
  parts?: Array<{
    content?: string;
  }>;
  wave?: {
    id?: string;
    name?: string;
  };
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "om.pub boosted meme generator",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Source returned ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function resolveTweet(id: string): Promise<CaptionSource> {
  const tweet = await fetchJson<TweetResult>(
    `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${tweetSyndicationToken(id)}`,
  );
  if (!tweet.text || !tweet.id_str) {
    throw new Error("Tweet could not be read");
  }
  const handle = tweet.user?.screen_name || "x";
  return {
    kind: "tweet",
    id: tweet.id_str,
    content: tweet.text,
    authorHandle: handle,
    url: `https://${compactTweetUrl(tweet.id_str)}`,
    label: "tweet",
    engagement: typeof tweet.favorite_count === "number"
      ? { count: tweet.favorite_count, type: "likes" }
      : undefined,
  };
}

async function resolveDrop(id: string): Promise<CaptionSource> {
  const drop = await fetchJson<DropResult>(`https://api.6529.io/api/drops/${id}`);
  if (!drop.id) throw new Error("Drop could not be read");

  const rawContent = (drop.parts || [])
    .map((part) => part.content?.trim())
    .filter(Boolean)
    .join("\n\n");
  let content = rawContent;
  const linkedTweet = rawContent.match(
    /https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^/\s]+\/status(?:es)?\/(\d+)/i,
  )?.[1];
  if (linkedTweet && !rawContent.replace(/https?:\/\/\S+/g, "").trim()) {
    content = (await resolveTweet(linkedTweet)).content;
  }
  if (!content) throw new Error("That drop has no caption text");

  const handle = drop.author?.handle || "6529";
  const url = drop.wave?.id
    ? `https://6529.io/waves/${drop.wave.id}?drop=${drop.id}`
    : `https://6529.io/?drop=${drop.id}`;
  return {
    kind: "drop",
    id: drop.id,
    content,
    authorHandle: handle,
    url,
    label: drop.wave?.name || "6529",
    engagement: typeof drop.boosts === "number"
      ? { count: drop.boosts, type: "boosts" }
      : undefined,
  };
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<CaptionSource | ErrorResponse>,
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Use GET for this endpoint" });
    return;
  }

  const input = Array.isArray(request.query.url)
    ? request.query.url[0]
    : request.query.url;
  if (!input || input.length > 500) {
    response.status(400).json({ error: "Paste a tweet or 6529 drop URL" });
    return;
  }

  try {
    const sourceReference = parseMemeSourceReference(input.trim());
    if (!sourceReference) {
      response.status(400).json({ error: "That is not a tweet or 6529 drop URL" });
      return;
    }
    const source = sourceReference.kind === "tweet"
      ? await resolveTweet(sourceReference.id)
      : await resolveDrop(sourceReference.id);
    response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    response.status(200).json(source);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Source could not be read";
    response.status(422).json({ error: message });
  }
}
