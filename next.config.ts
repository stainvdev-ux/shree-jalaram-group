import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "shreejalaramgroup.com", pathname: "/admin/uploads/**" },
      { protocol: "https", hostname: "shreejalaramgroup.com", pathname: "/assets/img/**" },
    ],
  },
};

export default nextConfig;
