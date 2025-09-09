import { NextConfig } from "next";
import { PluginOptions } from "./types";
import { TestIdTransformer } from "./transformer";

export { PluginOptions } from "./types";

export interface NextJSAutoTestIdConfig extends PluginOptions {
  // Additional Next.js specific options can go here
}

export function withAutoTestId(
  nextConfig: NextConfig = {},
  options: NextJSAutoTestIdConfig = {}
): NextConfig {
  const transformer = new TestIdTransformer(options);

  return {
    ...nextConfig,
    webpack: (config: any, context: any) => {
      // Call the original webpack function if it exists
      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, context);
      }

      // Only apply in development mode by default
      const shouldApply =
        options.enabled !== false && (context.dev || options.enabled === true);

      if (shouldApply) {
        // Add our custom loader
        config.module.rules.unshift({
          test: /\.(jsx?|tsx?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve("../dist/loader"),
              options: options,
            },
          ],
          enforce: "pre",
        });
      }

      return config;
    },
  };
}

// For backward compatibility and direct use
export default withAutoTestId;
