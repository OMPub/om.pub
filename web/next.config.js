/** @type {import('next').NextConfig} */

const VERSION = require("child_process")
  .execSync("git rev-parse HEAD")
  .toString()
  .trim();

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  // A stray lockfile in ~/projects makes Next infer the workspace root way up the
  // tree, so turbopack watches every repo under it (where agents constantly write)
  // and the dev server burns CPU on endless FSEvents invalidations. Pin the root.
  turbopack: {
    root: __dirname,
  },
  // wagmi's tempo connector probes an OPTIONAL dependency via import('accounts') and
  // catches the failure at runtime. Turbopack defers that to runtime; webpack resolves
  // it at build time and fails every page through _app. Stub it to an empty module so
  // wagmi's own catch path runs.
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, accounts: false };
    return config;
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'mixed-decls'],
  },
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    VERSION: VERSION,
    CHAIN_ID: process.env.CHAIN_ID,
    OMPUB_CONTRACT_ADDRESS: process.env.OMPUB_CONTRACT_ADDRESS,
  },
  async generateBuildId() {
    return VERSION;
  },
  i18n: {
    "locales": [
      "en",
      "ceb",
      "de",
      "sv",
      "fr",
      "nl",
      "ru",
      "es",
      "it",
      "arz",
      "pl",
      "ja",
      "zh",
      "vi",
      "war",
      "uk",
      "ar",
      "pt",
      "fa",
      "ca",
      "sr",
      "id",
      "ko",
      "no",
      "ce",
      "fi",
      "hu",
      "cs",
      "tr",
      "tt",
      "sh",
      "ro",
      "zh-min-nan",
      "eu",
      "ms",
      "eo",
      "he",
      "hy",
      "da",
      "bg",
      "cy",
      "sk",
      "azb",
      "et",
      "uz",
      "kk",
      "be",
      "simple",
      "min",
      "el",
      "hr",
      "lt",
      "gl",
      "az",
      "ur",
      "sl",
      "ka",
      "nn",
      "hi",
      "th",
      "ta",
      "la",
      "bn",
      "mk",
      "ast",
      "zh-yue",
      "lld",
      "lv",
      "tg",
      "af",
      "my",
      "mg",
      "bs",
      "mr",
      "sq",
      "oc",
      "nds",
      "ml",
      "be-tarask",
      "te",
      "ky",
      "br",
      "sw",
      "jv",
      "new",
      "vec",
      "pnb",
      "ht",
      "pms",
      "ba",
      "lb",
      "su",
      "ku",
      "ga",
      "lmo",
      "szl",
      "is",
      "fy",
      "cv",
    ],
    "defaultLocale": "en"
  }
};

module.exports = nextConfig;
