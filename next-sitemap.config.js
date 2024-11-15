// next-sitemap.config.js

const siteUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://spiral-gadgets.com';

// Disable sitemap generation by using an environment variable or condition
const generateSitemap = process.env.GENERATE_SITEMAP === 'true';  // Example using an env variable

module.exports = generateSitemap
  ? {
      siteUrl: siteUrl,
      generateRobotsTxt: true, // (Optional) Generates robots.txt
      // Other sitemap options can go here
    }
  : {};
