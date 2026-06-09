import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index-landing.html" },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/investor",
        destination: "/invest",
        permanent: true,
      },
      {
        source: "/nri-investment",
        destination: "/invest",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/webp"],
    qualities: [75, 90],
  },
};

export default nextConfig;
