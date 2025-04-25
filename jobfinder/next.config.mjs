/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disabling eslint during build as well
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Adjusting for possible image issues
    largePageDataBytes: 128 * 100000, // 12.8 MB - temporarily increase from default
  },
};

export default nextConfig; 