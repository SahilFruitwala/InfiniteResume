import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  // Next.js 16 uses Turbopack by default for dev and build.
  // If you have a custom webpack config, you must opt-out or migrate.
  // We keep this for AI Studio specific requirements.
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
  // Set explicit experimental flags if needed
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // Enable Cache Components (Next.js 16 feature)
  cacheComponents: true,
};

export default nextConfig;
