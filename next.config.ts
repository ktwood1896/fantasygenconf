import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000", 
        "glowing-halibut-5grwq977wxwx27v9g-3000.app.github.dev"
      ],
    },
  },
};

export default nextConfig;