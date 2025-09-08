/**
 * Webpack plugin to automatically inject data-testid attributes
 * Compatible with @pablohpsilva/data-testid-guidelines
 * Works with Next.js, Create React App, and other Webpack-based builds
 */

// Babel import removed - handled in the loader

class AutoTestIdWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      // Only apply in development and test environments by default
      enabled:
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test",
      separator: ".",
      includeElement: true,
      useHierarchy: true,
      skipElements: ["br", "hr", "img", "svg"],
      onlyInteractive: false,
      // File patterns to transform
      include: /\.(tsx?|jsx?)$/,
      exclude: /node_modules/,
      ...options,
    };
  }

  apply(compiler) {
    if (!this.options.enabled) {
      return;
    }

    const pluginName = "AutoTestIdWebpackPlugin";

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // Hook into the module building process
      compiler.hooks.normalModuleFactory.tap(pluginName, (factory) => {
        factory.hooks.afterResolve.tap(pluginName, (resolveData) => {
          const { resource } = resolveData;

          // Check if file should be processed
          if (!this.shouldTransform(resource)) {
            return;
          }

          // Store original loader
          const originalLoader = resolveData.loaders;

          // Add our transformation loader
          resolveData.loaders = [
            ...originalLoader,
            {
              loader: require.resolve(
                "../examples-nextjs/webpack-auto-testid-loader.js"
              ),
              options: this.options,
            },
          ];
        });
      });
    });
  }

  shouldTransform(resource) {
    if (!resource) return false;

    // Exclude node_modules
    if (this.options.exclude.test(resource)) {
      return false;
    }

    // Include only matching files
    return this.options.include.test(resource);
  }
}

module.exports = AutoTestIdWebpackPlugin;
