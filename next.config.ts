import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack:(config)=>{
    config.externals.push({
       "utf-8-validate":"commonjs utf-8-validate",
       bufferutil:"commonjs bufferutil"
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript:{
     ignoreBuildErrors: true,
  }
};

export default nextConfig;
