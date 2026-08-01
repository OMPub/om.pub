import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { ImageResponse } from "next/og";
import type { NextApiRequest, NextApiResponse } from "next";

import { sourceAttribution } from "@/lib/memeAttribution";
import {
  decodeMemeShare,
  DEFAULT_STANDALONE_MEME_URL,
  MEME_SHARE_QUERY_KEY,
} from "@/lib/memeShare";

const INTER_BOLD = resolve(process.cwd(), "src/styles/fonts/Inter-Bold.ttf");
const ALLOWED_APP_HOSTS = new Set([
  "om.pub",
  "www.om.pub",
  "arweave.net",
  "arweave.dev",
  "ar.io",
]);

function safeAppBase(value: string | null) {
  const fallback = new URL(DEFAULT_STANDALONE_MEME_URL);
  if (!value) return fallback;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const allowed =
      url.protocol === "https:" &&
      (ALLOWED_APP_HOSTS.has(hostname) ||
        hostname.endsWith(".arweave.net") ||
        hostname.endsWith(".arweave.dev") ||
        hostname.endsWith(".ar.io"));
    if (!allowed) return fallback;
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return fallback;
  }
}

function captionFontSize(text: string) {
  const wordCount = Math.max(1, text.trim().split(/\s+/).length);
  return Math.max(
    34,
    Math.min(92, 1200 * Math.min(0.078, 0.54 / Math.sqrt(wordCount))),
  );
}

function Caption({
  placement,
  text,
}: {
  placement: "top" | "bottom";
  text: string;
}) {
  if (!text) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 28,
        right: 28,
        [placement]: placement === "top" ? 78 : 86,
        display: "flex",
        justifyContent: "center",
        color: "#fffaf0",
        fontFamily: "Inter",
        fontSize: captionFontSize(text),
        fontWeight: 900,
        lineHeight: 0.97,
        textAlign: "center",
        textTransform: "uppercase",
        textShadow: "0 5px 8px rgba(0,0,0,.6)",
        WebkitTextStroke: "7px rgba(15,12,9,.96)",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
}

export async function renderMemeImageResponse(
  requestUrl: URL,
  accept: string,
) {
  const rawPayload = requestUrl.searchParams.get(MEME_SHARE_QUERY_KEY);
  const payload = decodeMemeShare(rawPayload);
  if (!payload) {
    return new Response("Invalid or missing meme state", { status: 400 });
  }

  const appUrl = safeAppBase(requestUrl.searchParams.get("b"));
  appUrl.searchParams.set(MEME_SHARE_QUERY_KEY, rawPayload!);
  if (accept.includes("text/html")) {
    return Response.redirect(appUrl, 307);
  }

  const artworkUrl = new URL(
    `/boosted-reactions/renderer/${payload.reactionFile.replace(/\.webp$/, ".jpg")}`,
    DEFAULT_STANDALONE_MEME_URL,
  );
  const artworkResponse = await fetch(artworkUrl);
  if (!artworkResponse.ok) {
    return new Response("Artwork unavailable", { status: 502 });
  }
  const artwork = `data:${artworkResponse.headers.get("content-type") || "image/jpeg"};base64,${Buffer.from(
    await artworkResponse.arrayBuffer(),
  ).toString("base64")}`;
  const font = await readFile(INTER_BOLD);
  const attribution = sourceAttribution(payload.source).text;
  const attributionSize = attribution.length > 90 ? 16 : attribution.length > 72 ? 18 : 22;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          background: "#d7c9ad",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={artwork}
          width="1200"
          height="1500"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "0 0 auto",
            height: 470,
            display: "flex",
            background: "linear-gradient(rgba(12,10,8,.67), rgba(12,10,8,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "auto 0 0",
            height: 530,
            display: "flex",
            background: "linear-gradient(rgba(12,10,8,0), rgba(12,10,8,.82))",
          }}
        />
        <Caption placement="top" text={payload.topText} />
        <Caption placement="bottom" text={payload.bottomText} />
        {payload.attributionVisible && (
          <div
            style={{
              position: "absolute",
              left: 48,
              right: 48,
              bottom: 18,
              display: "flex",
              justifyContent: "center",
              color: "rgba(255,250,240,.72)",
              fontFamily: "Inter",
              fontSize: attributionSize,
              fontWeight: 700,
              textAlign: "center",
              textShadow: "0 2px 8px rgba(0,0,0,.8)",
              whiteSpace: "nowrap",
            }}
          >
            {attribution}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 1500,
      fonts: [
        {
          name: "Inter",
          data: font,
          weight: 900,
          style: "normal",
        },
      ],
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=31536000, immutable",
        "Content-Disposition": `inline; filename="boosted-reaction-${payload.source.id.slice(0, 8)}.png"`,
        Vary: "Accept",
      },
    },
  );
}

function requestUrl(request: NextApiRequest) {
  const protocol = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers.host || "om.pub";
  return new URL(request.url || "/booster/image.png", `${protocol}://${host}`);
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    response.status(405).send("Use GET or HEAD for this endpoint");
    return;
  }

  const rendered = await renderMemeImageResponse(
    requestUrl(request),
    request.headers.accept || "",
  );
  rendered.headers.forEach((value, key) => response.setHeader(key, value));
  response.status(rendered.status);
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  response.send(Buffer.from(await rendered.arrayBuffer()));
}
