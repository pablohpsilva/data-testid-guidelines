import { PluginObj, PluginPass } from '@babel/core';

export interface AutoTestIdOptions {
  separator?: string;
  includeElement?: boolean;
  useHierarchy?: boolean;
  skipElements?: string[];
  onlyInteractive?: boolean;
}

export default function babelPluginAutoTestId(options?: AutoTestIdOptions): PluginObj<PluginPass>;
