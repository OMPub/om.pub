import { compactTweetUrl } from "@/lib/memeSourceUrl";

type AttributionSource = {
  kind: "drop" | "tweet";
  id: string;
  authorHandle: string;
  label: string;
  engagement?: {
    count: number;
    type: "boosts" | "likes";
  };
};

export function sourceAttribution(source: AttributionSource) {
  const engagement = source.engagement;
  const metric = engagement
    ? `${engagement.count.toLocaleString("en-US")} ${
      engagement.count === 1
        ? engagement.type.slice(0, -1)
        : engagement.type
    }`
    : source.kind === "tweet" ? "tweet" : "drop";
  const sourceLabel = source.kind === "tweet"
    ? compactTweetUrl(source.id)
    : source.label;
  return {
    parts: [`@${source.authorHandle}`, sourceLabel, metric],
    text: `@${source.authorHandle}  ·  ${sourceLabel}  ·  ${metric}`,
  };
}
