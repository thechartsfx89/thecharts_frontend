/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "localhost",
      "kooqxit.com",
      "d1z78r8i505acl.cloudfront.net",
      "promising-dawn-4e52af264d.media.strapiapp.com",
      "72.62.194.30",
      "img.feminaforce.com",
      "api.feminaforce.com",
      "api.educandle.com"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ngrok-free.dev",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "72.62.194.30",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: 'https',
        hostname: 'img.feminaforce.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: "https",
        hostname: "api.educandle.com",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.educandle.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
