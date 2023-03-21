/** @type {import('next').NextConfig} */

const VERSION = require("child_process")
  .execSync("git rev-parse HEAD")
  .toString()
  .trim();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    VERSION: VERSION,
    CHAIN_ID: process.env.CHAIN_ID,
    OMPUB_CONTRACT_ADDRESS: process.env.OMPUB_CONTRACT_ADDRESS,
  },
  async generateBuildId() {
    return VERSION;
  },
};

module.exports = nextConfig;
