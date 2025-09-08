const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // APPROACH 1: Webpack Loader (recommended - works with loop indexing)
  // Uses Babel transformation through Webpack loader for perfect test ID generation
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Only apply in development and test environments
    if (dev || process.env.NODE_ENV === "test") {
      // Add our custom loader to process JSX/TSX files
      config.module.rules.push({
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve("./webpack-auto-testid-loader-fixed.js"),
            options: {
              enabled: true,
              separator: ".",
              includeElement: true,
              useHierarchy: true,
              skipElements: ["br", "hr", "img", "svg"],
              onlyInteractive: false,
            },
          },
        ],
        enforce: "pre", // Run before other loaders
      });
    }

    return config;
  },

  // APPROACH 2: SWC Plugin (partial functionality)
  // Uses our custom-built SWC plugin but doesn't handle loop indexing
  /* 
  experimental: {
    swcPlugins: [
      [
        path.resolve("./swc_plugin_auto_testid.wasm"),
        {
          separator: ".",
          includeElement: true,
          useHierarchy: true,
          skipElements: ["br", "hr", "img", "svg"],
          onlyInteractive: false,
        },
      ],
    ],
  },
  */
};

module.exports = nextConfig;
