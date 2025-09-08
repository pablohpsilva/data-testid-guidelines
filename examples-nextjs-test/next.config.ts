import type { NextConfig } from "next";
import { withAutoTestId } from "@pablohpsilva/nextjs-auto-testid";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withAutoTestId(nextConfig, {
  enabled: true,
  separator: ".",
  includeElement: true,
  useHierarchy: true,
  skipElements: ["br", "hr", "img", "svg"],
  onlyInteractive: false,
});
