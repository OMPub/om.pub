const API_ROOT = "https://api.6529.io/api";
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const IPFS_URL = /^ipfs:\/\/([a-zA-Z0-9]+)(\/.*)?$/;

export type MemeAuthorRep = {
  category: string;
  totalRep: number;
};

export type MemeAuthorProfile = {
  handle: string;
  level: number;
  tdh: number;
  rep: number;
  pfp: string;
  banner1: string;
  banner2: string;
  topRep: MemeAuthorRep[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

export function normalizeProfileImageUrl(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const ipfs = value.match(IPFS_URL);
  if (ipfs) {
    return `https://ipfs.io/ipfs/${ipfs[1]}${ipfs[2] ?? ""}`;
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function profileColor(value: unknown, fallback: string) {
  return typeof value === "string" && HEX_COLOR.test(value)
    ? value
    : fallback;
}

export function parseMemeAuthorProfile(
  identity: unknown,
  repCategories: unknown,
): MemeAuthorProfile | null {
  if (!isRecord(identity) || typeof identity.handle !== "string") return null;
  const categories = isRecord(repCategories) && Array.isArray(repCategories.data)
    ? repCategories.data
    : [];
  const topRep = categories
    .filter(
      (item): item is Record<string, unknown> =>
        isRecord(item) &&
        typeof item.category === "string" &&
        typeof item.total_rep === "number" &&
        Number.isFinite(item.total_rep),
    )
    .slice(0, 5)
    .map((item) => ({
      category: item.category as string,
      totalRep: Math.max(0, item.total_rep as number),
    }));

  return {
    handle: identity.handle,
    level: finiteNumber(identity.level),
    tdh: finiteNumber(identity.tdh),
    rep: finiteNumber(identity.rep),
    pfp: normalizeProfileImageUrl(identity.pfp),
    banner1: profileColor(identity.banner1, "#24343b"),
    banner2: profileColor(identity.banner2, "#6b3640"),
    topRep,
  };
}

export async function fetchMemeAuthorProfile(
  authorHandle: string,
  signal: AbortSignal,
) {
  const identity = authorHandle.trim().replace(/^@/, "");
  if (!identity) return null;
  const encodedIdentity = encodeURIComponent(identity);
  const [identityResponse, repResponse] = await Promise.all([
    fetch(`${API_ROOT}/identities/${encodedIdentity}`, { signal }),
    fetch(
      `${API_ROOT}/profiles/${encodedIdentity}/rep/categories?direction=incoming&page_size=5&top_contributors_limit=1`,
      { signal },
    ).catch(() => null),
  ]);
  if (!identityResponse.ok) return null;
  const identityData: unknown = await identityResponse.json();
  const repData: unknown = repResponse?.ok
    ? await repResponse.json()
    : { data: [] };
  return parseMemeAuthorProfile(identityData, repData);
}
