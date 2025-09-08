/** @type {import('next').NextConfig} */
const { withAutoTestId } = require("@pablohpsilva/nextjs-auto-testid");

const nextConfig = {
  // Your existing Next.js configuration
};

module.exports = withAutoTestId(nextConfig, {
  enabled: true, // Enable for testing
  separator: ".",
  includeElement: true,
  useHierarchy: true,
  skipElements: ["br", "hr", "img", "svg"],
  onlyInteractive: false,
});
