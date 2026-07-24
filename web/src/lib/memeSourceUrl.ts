export type MemeSourceReference = {
  kind: "drop" | "tweet";
  id: string;
};

const TWEET_HOSTS = new Set([
  "mobile.twitter.com",
  "twitter.com",
  "www.twitter.com",
  "x.com",
  "www.x.com",
]);
const DROP_HOSTS = new Set([
  "6529.io",
  "api.6529.io",
  "www.6529.io",
]);
const DROP_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function tweetSyndicationToken(id: string) {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(36)
    .replace(/(0+|\.)/g, "");
}

export function compactTweetUrl(id: string) {
  return `x.com/i/status/${id}`;
}

export function parseMemeSourceReference(input: string): MemeSourceReference | null {
  try {
    const normalized = /^[a-z][a-z0-9+.-]*:\/\//i.test(input)
      ? input
      : `https://${input}`;
    const url = new URL(normalized);
    const hostname = url.hostname.toLowerCase();

    if (TWEET_HOSTS.has(hostname)) {
      const id = url.pathname.match(/\/status(?:es)?\/(\d+)/i)?.[1];
      return id ? { kind: "tweet", id } : null;
    }

    if (DROP_HOSTS.has(hostname)) {
      const queryId = url.searchParams.get("drop") || url.searchParams.get("drop_id");
      if (queryId && DROP_ID.test(queryId)) return { kind: "drop", id: queryId };
      const pathId = url.pathname.match(/\/drops\/([0-9a-f-]{36})(?:\/|$)/i)?.[1];
      if (pathId && DROP_ID.test(pathId)) return { kind: "drop", id: pathId };
    }
  } catch {
    return null;
  }
  return null;
}
