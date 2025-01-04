import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Define the hostname
        pathname: '/**', // Allow all paths under the given hostname
      },
    ],
  },
  productionBrowserSourceMaps: false, // Disable source maps in production
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  webpack(config, { isServer }) {
    // Disable source map warnings in development
    if (!isServer) {
      config.devtool = false;
    }
    return config;
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  register: true,
  skipWaiting: true,
  sw: '/sw.js', // Specify the service worker path if needed
  buildExcludes: [/middleware-manifest.json$/], // Avoid caching middleware manifest
})(nextConfig);
