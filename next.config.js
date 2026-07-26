/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000'],
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
