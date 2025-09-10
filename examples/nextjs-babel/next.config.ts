import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to use Webpack with Babel
  experimental: {
    turbopack: false,
  },
  webpack: (config, { isServer, dev }) => {
    // Replace SWC with Babel for JS/TS/JSX/TSX files
    config.module.rules = config.module.rules.map((rule: any) => {
      if (rule.test && rule.test.toString().includes("tsx")) {
        return {
          ...rule,
          use: [
            {
              loader: "babel-loader",
              options: {
                configFile: "./.babelrc",
              },
            },
          ],
        };
      }
      return rule;
    });

    return config;
  },
};

export default nextConfig;
