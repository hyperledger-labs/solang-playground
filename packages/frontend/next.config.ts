import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/compile",
        destination: "http://localhost:4444/compile",
      },
      {
        source: "/health",
        destination: "http://localhost:4444/health",
      },
    ];
  },

  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      vscode: require.resolve("monaco-languageclient/vscode-compatibility"),
    };
    return config;
  },
};

export default nextConfig;
