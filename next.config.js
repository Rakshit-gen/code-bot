/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // --- TypeScript Settings ---
  typescript: {
    // ⚠️ Allow production builds to complete even if there are TS errors
    ignoreBuildErrors: true,
  },

  // --- ESLint Settings ---
  eslint: {
    // ⚠️ Skip ESLint checks during production builds
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
