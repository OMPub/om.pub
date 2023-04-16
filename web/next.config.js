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
  i18n: {
    locales: [
      'en-US',
      'fr-FR',
      'es-ES',
      'zh-CN',
      'ar-SA',
      'pt-PT',
      'bn-BD',
      'ru-RU',
      'ja-JP',
      'de-DE',
      'ko-KR',
      'tr-TR',
      'id-ID',
      'ms-MY',
      'it-IT',
      'pl-PL',
      'vi-VN',
      'th-TH',
    ],
    defaultLocale: "en-US",
  }
};

module.exports = nextConfig;
