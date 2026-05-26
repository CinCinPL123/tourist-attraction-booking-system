import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sequelize"],
  allowedDevOrigins: ['26.79.203.6'],
};

export default nextConfig;
