import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  redirects() {
    return [
      { source: "/gioi-thieu", destination: "/about", permanent: true },
      { source: "/ung-dung/ma-soi", destination: "/apps/werewolf", permanent: true },
      { source: "/ung-dung/office-jukebox", destination: "/apps/office-jukebox", permanent: true },
      { source: "/ung-dung/sao-ke", destination: "/apps/statements", permanent: true },
    ];
  },
};

export default nextConfig;
