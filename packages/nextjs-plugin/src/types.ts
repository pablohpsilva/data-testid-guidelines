export interface PluginOptions {
  enabled?: boolean;
  separator?: string;
  includeElement?: boolean;
  useHierarchy?: boolean;
  skipElements?: string[];
  onlyInteractive?: boolean;
}

export interface TestIdContext {
  componentName?: string;
  hierarchy: string[];
  loopIndices: Map<string, number>;
  elementCounts: Map<string, number>;
}

export const DEFAULT_OPTIONS: Required<PluginOptions> = {
  enabled: true,
  separator: ".",
  includeElement: true,
  useHierarchy: true,
  skipElements: ["br", "hr", "img", "svg"],
  onlyInteractive: false,
};

export const INTERACTIVE_ELEMENTS = new Set([
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "form",
  "fieldset",
  "details",
  "summary",
  "dialog",
  "menu",
  "menuitem",
  "label",
]);

export const SEMANTIC_ELEMENTS = new Set([
  "header",
  "main",
  "footer",
  "nav",
  "aside",
  "section",
  "article",
]);
