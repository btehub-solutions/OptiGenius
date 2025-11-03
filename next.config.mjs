/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Optimize images if you add any in the future
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: []
  }
};

export default nextConfig;
