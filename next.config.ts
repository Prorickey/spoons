import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone" // Needed for docker to work
};

export default nextConfig;
