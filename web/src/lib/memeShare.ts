import { parseMemeSourceReference } from "@/lib/memeSourceUrl";

export const MEME_SHARE_QUERY_KEY = "m";
export const DEFAULT_STANDALONE_MEME_URL =
  "https://om.pub/booster";
export const DEFAULT_MEME_IMAGE_URL =
  "https://om.pub/booster/image.png";

export type MemeShareSource = {
  kind: "drop" | "tweet";
  id: string;
  content: string;
  authorHandle: string;
  url: string;
  label: string;
  preferredCaption?: {
    top: string;
    bottom: string;
  };
  engagement?: {
    count: number;
    type: "boosts" | "likes";
  };
};

export type MemeSharePayload = {
  version: 1;
  reactionFile: string;
  source: MemeShareSource;
  topText: string;
  bottomText: string;
  attributionVisible: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringWithin(
  value: unknown,
  minimum: number,
  maximum: number,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= minimum &&
    value.length <= maximum
  );
}

function parseSource(value: unknown): MemeShareSource | null {
  if (!isRecord(value)) return null;
  if (value.kind !== "drop" && value.kind !== "tweet") return null;
  if (!isStringWithin(value.id, 1, 100)) return null;
  if (!isStringWithin(value.content, 1, 2000)) return null;
  if (!isStringWithin(value.authorHandle, 1, 100)) return null;
  if (!isStringWithin(value.url, 1, 1000)) return null;
  if (!isStringWithin(value.label, 1, 200)) return null;

  try {
    if (new URL(value.url).protocol !== "https:") return null;
  } catch {
    return null;
  }
  const reference = parseMemeSourceReference(value.url);
  if (
    !reference ||
    reference.kind !== value.kind ||
    reference.id !== value.id
  ) {
    return null;
  }

  let preferredCaption: MemeShareSource["preferredCaption"];
  if (value.preferredCaption !== undefined) {
    if (!isRecord(value.preferredCaption)) return null;
    if (!isStringWithin(value.preferredCaption.top, 0, 5000)) return null;
    if (!isStringWithin(value.preferredCaption.bottom, 0, 5000)) return null;
    preferredCaption = {
      top: value.preferredCaption.top,
      bottom: value.preferredCaption.bottom,
    };
  }

  let engagement: MemeShareSource["engagement"];
  if (value.engagement !== undefined) {
    if (!isRecord(value.engagement)) return null;
    if (
      !Number.isSafeInteger(value.engagement.count) ||
      (value.engagement.count as number) < 0 ||
      (value.engagement.count as number) > 1_000_000_000_000
    ) {
      return null;
    }
    if (
      value.engagement.type !== "boosts" &&
      value.engagement.type !== "likes"
    ) {
      return null;
    }
    engagement = {
      count: value.engagement.count as number,
      type: value.engagement.type,
    };
  }

  return {
    kind: value.kind,
    id: value.id,
    content: value.content,
    authorHandle: value.authorHandle,
    url: value.url,
    label: value.label,
    ...(preferredCaption ? { preferredCaption } : {}),
    ...(engagement ? { engagement } : {}),
  };
}

export function decodeMemeShare(value: string | null): MemeSharePayload | null {
  if (!value || value.length > 20_000) return null;
  try {
    const payload: unknown = JSON.parse(value);
    if (!isRecord(payload) || payload.version !== 1) return null;
    if (
      !isStringWithin(payload.reactionFile, 1, 100) ||
      !/^reaction-\d{3}\.webp$/.test(payload.reactionFile)
    ) {
      return null;
    }
    if (!isStringWithin(payload.topText, 0, 5000)) return null;
    if (!isStringWithin(payload.bottomText, 0, 5000)) return null;
    if (!payload.topText && !payload.bottomText) return null;
    if (typeof payload.attributionVisible !== "boolean") return null;
    const source = parseSource(payload.source);
    if (!source) return null;

    return {
      version: 1,
      reactionFile: payload.reactionFile,
      source,
      topText: payload.topText,
      bottomText: payload.bottomText,
      attributionVisible: payload.attributionVisible,
    };
  } catch {
    return null;
  }
}

export function createMemeShareUrl(
  baseUrl: string,
  payload: MemeSharePayload,
) {
  const url = new URL(baseUrl);
  url.search = "";
  url.hash = "";
  url.searchParams.set(MEME_SHARE_QUERY_KEY, JSON.stringify(payload));
  return url.toString();
}

export function createStandaloneMemeShareUrl(
  payload: MemeSharePayload,
  baseUrl = process.env.NEXT_PUBLIC_BOOSTED_REACTIONS_STANDALONE_URL ||
    DEFAULT_STANDALONE_MEME_URL,
) {
  return createMemeShareUrl(baseUrl, payload);
}

export function createMemeImageUrl(
  payload: MemeSharePayload,
  appUrl = createStandaloneMemeShareUrl(payload),
  imageBaseUrl = DEFAULT_MEME_IMAGE_URL,
) {
  const app = new URL(appUrl);
  const appBase = new URL(app);
  appBase.search = "";
  appBase.hash = "";
  const image = new URL(imageBaseUrl);
  image.search = "";
  image.hash = "";
  image.searchParams.set(MEME_SHARE_QUERY_KEY, JSON.stringify(payload));
  if (appBase.toString() !== `${DEFAULT_STANDALONE_MEME_URL}`) {
    image.searchParams.set("b", appBase.toString());
  }
  return image.toString();
}
