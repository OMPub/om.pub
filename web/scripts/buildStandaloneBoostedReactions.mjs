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

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(scriptDirectory, "..");
const assetRoot = join(webRoot, "public", "boosted-reactions");
const templatePath = join(
  webRoot,
  "standalone",
  "boosted-reactions.template.html",
);
const outputPath = join(assetRoot, "standalone.html");
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
  const output = join(
    temporaryDirectory,
    reaction.file.replace(/\.webp$/i, ".jpg"),
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
  return {
    ...reaction,
    image: `data:image/jpeg;base64,${readFileSync(output).toString("base64")}`,
  };
}

try {
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
    `Built ${outputPath} (${megabytes} MiB, ${reactions.length} embedded images, build ${buildHash})\n`,
  );
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
