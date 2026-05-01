/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // This tells Next.js not to pre-render pages that use browser APIs
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;