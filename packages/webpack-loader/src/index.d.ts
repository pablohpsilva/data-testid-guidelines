import { LoaderContext } from "webpack";

export interface AutoTestIdOptions {
  enabled?: boolean;
  separator?: string;
  includeElement?: boolean;
  useHierarchy?: boolean;
  skipElements?: string[];
  onlyInteractive?: boolean;
}

declare function webpackAutoTestIdLoader(
  this: LoaderContext<AutoTestIdOptions>,
  source: string
): string;

export default webpackAutoTestIdLoader;
