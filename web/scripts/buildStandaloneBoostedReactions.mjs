import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

import { memeKeyboardAction } from "../src/lib/memeKeyboard.mjs";
import {
  appendSlideTimingDigit,
  nextLoopingHistoryIndex,
  normalizeSlideSeconds,
  removeHistoryEntry,
} from "../src/lib/memeHistory.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(scriptDirectory, "..");
const assetRoot = join(webRoot, "public", "boosted-reactions");
const templatePath = join(
  webRoot,
  "standalone",
  "boosted-reactions.template.html",
);
const outputPath = join(assetRoot, "standalone.html");
const rendererRoot = join(assetRoot, "renderer");
const temporaryDirectory = mkdtempSync(
  join(tmpdir(), "ompub-boosted-standalone-"),
);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function scriptSafeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function resizeReaction(reaction) {
  const input = join(assetRoot, "reactions", reaction.file);
  const rendererFile = reaction.file.replace(/\.webp$/i, ".jpg");
  const output = join(
    temporaryDirectory,
    rendererFile,
  );
  const result = spawnSync(
    "sips",
    [
      "-s",
      "format",
      "jpeg",
      "-s",
      "formatOptions",
      "55",
      "--resampleHeightWidth",
      "750",
      "600",
      input,
      "--out",
      output,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(
      `Could not optimize ${reaction.file} with sips: ${result.stderr.trim()}`,
    );
  }
  const image = readFileSync(output);
  writeFileSync(join(rendererRoot, rendererFile), image);
  return {
    ...reaction,
    image: `data:image/jpeg;base64,${image.toString("base64")}`,
  };
}

try {
  rmSync(rendererRoot, { recursive: true, force: true });
  mkdirSync(rendererRoot, { recursive: true });
  const reactionIndex = readJson(
    join(assetRoot, "reactions", "index.json"),
  );
  const tweets = readJson(join(assetRoot, "punk6529-tweets.json")).tweets;
  const drops = readJson(join(assetRoot, "drops-cache.json")).data;
  const reactions = reactionIndex.map(resizeReaction);
  const favicon = readFileSync(join(assetRoot, "favicon-32.png")).toString(
    "base64",
  );
  const buildHash = createHash("sha256")
    .update(scriptSafeJson(reactionIndex))
    .update(scriptSafeJson(tweets))
    .update(scriptSafeJson(drops))
    .digest("hex")
    .slice(0, 12);

  const replacements = new Map([
    ["__STANDALONE_BUILD__", buildHash],
    ["__FAVICON_DATA_URI__", `data:image/png;base64,${favicon}`],
    ["__REACTIONS_JSON__", scriptSafeJson(reactions)],
    ["__TWEETS_JSON__", scriptSafeJson(tweets)],
    ["__DROPS_JSON__", scriptSafeJson(drops)],
    ["__KEYBOARD_ACTION_SOURCE__", memeKeyboardAction.toString()],
    ["__APPEND_SLIDE_DIGIT_SOURCE__", appendSlideTimingDigit.toString()],
    ["__NEXT_HISTORY_INDEX_SOURCE__", nextLoopingHistoryIndex.toString()],
    ["__NORMALIZE_SLIDE_SECONDS_SOURCE__", normalizeSlideSeconds.toString()],
    ["__REMOVE_HISTORY_ENTRY_SOURCE__", removeHistoryEntry.toString()],
  ]);
  let output = readFileSync(templatePath, "utf8");
  for (const [placeholder, value] of replacements) {
    if (!output.includes(placeholder)) {
      throw new Error(`Missing template placeholder: ${placeholder}`);
    }
    output = output.replaceAll(placeholder, value);
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, output);
  const megabytes = (statSync(outputPath).size / 1024 / 1024).toFixed(2);
  process.stdout.write(
    `Built ${outputPath} (${megabytes} MiB, ${reactions.length} embedded images and renderer JPEGs, build ${buildHash})\n`,
  );
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
