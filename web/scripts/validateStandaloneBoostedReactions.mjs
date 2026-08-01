import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const htmlPath = resolve("public", "boosted-reactions", "standalone.html");
const rendererPath = resolve("public", "boosted-reactions", "renderer");
const html = readFileSync(htmlPath, "utf8");
const scripts = Array.from(
  html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g),
  (match) => match[1],
);

if (scripts.length !== 4) {
  throw new Error(`Expected four inline scripts, found ${scripts.length}`);
}

// Parse the three embedded corpora and compile the application source.
const reactions = JSON.parse(scripts[0]);
const tweets = JSON.parse(scripts[1]);
const drops = JSON.parse(scripts[2]);
new Function(scripts[3]);

const unresolved = Array.from(
  html.matchAll(/__[A-Z][A-Z0-9_]+__/g),
  (match) => match[0],
);
if (unresolved.length) {
  throw new Error(`Unresolved template values: ${unresolved.join(", ")}`);
}

const localSubresources = Array.from(
  html.matchAll(/(?:src|href)=["'](?!data:|https:|#)([^"']+)/g),
  (match) => match[1],
);
if (localSubresources.length) {
  throw new Error(
    `Standalone file has local subresources: ${localSubresources.join(", ")}`,
  );
}

if (reactions.length !== 167 || tweets.length !== 50 || drops.length < 1) {
  throw new Error(
    `Unexpected corpus: ${reactions.length} images, ${tweets.length} tweets, ${drops.length} drops`,
  );
}

const rendererImages = readdirSync(rendererPath).filter((file) =>
  /^reaction-\d{3}\.jpg$/.test(file),
);
if (rendererImages.length !== reactions.length) {
  throw new Error(
    `Expected ${reactions.length} renderer JPEGs, found ${rendererImages.length}`,
  );
}

process.stdout.write(
  `Validated ${htmlPath}: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MiB, ` +
  `${reactions.length} images and renderer JPEGs, ${tweets.length} tweets, ${drops.length} drops, no local subresources\n`,
);
