/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Define the hostname
        pathname: '/**', // This allows all paths under the given hostname
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

export default nextConfig;
