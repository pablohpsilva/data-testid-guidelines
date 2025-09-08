/** @type {import('next').NextConfig} */

// Use the plugin with configuration
module.exports = {
  enabled: true, // Enable for testing
  separator: ".",
  includeElement: true,
  useHierarchy: true,
  skipElements: ["br", "hr", "img", "svg"],
  onlyInteractive: false,
};
