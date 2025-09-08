/**
 * Vite plugin to automatically inject data-testid attributes
 * Compatible with @pablohpsilva/data-testid-guidelines
 */

import { transformSync } from "@babel/core";
import babelPluginAutoTestId from "./babel-plugin-auto-testid.js";

export function autoTestId(options = {}) {
  const {
    include = /\.(jsx|tsx)$/,
    exclude = /node_modules/,
    ...babelOptions
  } = options;

  return {
    name: "vite-plugin-auto-testid",
    enforce: "pre", // Run before other plugins

    transform(code, id) {
      // Only process JSX/TSX files
      if (!include.test(id) || exclude.test(id)) {
        return null;
      }

      try {
        const result = transformSync(code, {
          filename: id,
          plugins: [[babelPluginAutoTestId, babelOptions]],
          configFile: false,
          babelrc: false,
        });

        return {
          code: result?.code || code,
          map: result?.map,
        };
      } catch (error) {
        console.warn(`Failed to transform ${id}:`, error.message);
        return null;
      }
    },

    // Development mode: hot reload support
    handleHotUpdate(ctx) {
      // Re-transform the file on hot updates
      if (include.test(ctx.file) && !exclude.test(ctx.file)) {
        ctx.server.reloadModule(ctx.modules[0]);
      }
    },

    // Build mode: ensure proper integration
    generateBundle(options, bundle) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "Auto TestId plugin: Processed files with automatic test IDs"
        );
      }
    },
  };
}

// Default export for CommonJS compatibility
export default autoTestId;
