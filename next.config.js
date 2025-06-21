/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3001',
      'http://192.168.1.75:3001', // Your LAN IP
    ],
  },
}

module.exports = nextConfig
