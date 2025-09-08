import { LoaderContext } from "webpack";
import { PluginOptions } from "./types";
import { TestIdTransformer } from "./transformer";

interface LoaderOptions extends PluginOptions {}

export default function autoTestIdLoader(
  this: LoaderContext<LoaderOptions>,
  source: string
): string {
  // Get options from loader context
  const options = this.getOptions() || {};

  // Create transformer instance
  const transformer = new TestIdTransformer(options);

  // Transform the source code
  const result = transformer.transform(source, this.resourcePath);

  return result;
}

// Required for webpack to recognize this as a loader
module.exports = autoTestIdLoader;
module.exports.default = autoTestIdLoader;
