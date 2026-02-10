import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1', // Allow local Django media during dev
      },
    ],
  },
};

export default nextConfig;
