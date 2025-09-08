import {
  PluginOptions,
  TestIdContext,
  DEFAULT_OPTIONS,
  INTERACTIVE_ELEMENTS,
} from "./types";

export function mergeOptions(
  options: PluginOptions = {}
): Required<PluginOptions> {
  return { ...DEFAULT_OPTIONS, ...options };
}

export function shouldSkipElement(
  elementName: string,
  options: Required<PluginOptions>
): boolean {
  if (options.skipElements.includes(elementName)) {
    return true;
  }

  if (options.onlyInteractive && !INTERACTIVE_ELEMENTS.has(elementName)) {
    return true;
  }

  return false;
}

export function generateTestId(
  elementName: string,
  context: TestIdContext,
  options: Required<PluginOptions>
): string {
  const parts: string[] = [];

  // Add component name if we have one
  if (context.componentName) {
    parts.push(context.componentName);
  }

  // Add hierarchy if enabled
  if (options.useHierarchy && context.hierarchy.length > 0) {
    parts.push(...context.hierarchy);
  }

  // Add element name if enabled
  if (options.includeElement && elementName) {
    parts.push(elementName);
  }

  return parts.join(options.separator);
}

export function getComponentNameFromFunction(
  code: string,
  start: number
): string | null {
  // Look backwards from the start position to find function declaration
  const beforeStart = code.substring(0, start);

  // Try to find function or const declarations
  const functionMatch = beforeStart.match(
    /(?:export\s+)?(?:function\s+(\w+)|const\s+(\w+)\s*=)/g
  );

  if (functionMatch && functionMatch.length > 0) {
    const lastMatch = functionMatch[functionMatch.length - 1];
    const nameMatch = lastMatch.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=)/);
    return nameMatch ? nameMatch[1] || nameMatch[2] : null;
  }

  return null;
}

export function detectLoopContext(
  code: string,
  position: number
): string | null {
  // Look for .map, .forEach, for loops, etc. around the current position
  const beforePosition = code.substring(Math.max(0, position - 200), position);

  // Check for .map() calls
  const mapMatch = beforePosition.match(
    /(\w+)\.map\s*\(\s*\(.*?,\s*(\w+)\s*\)/
  );
  if (mapMatch) {
    return mapMatch[1]; // Return the array variable name
  }

  // Check for .forEach() calls
  const forEachMatch = beforePosition.match(
    /(\w+)\.forEach\s*\(\s*\(.*?,\s*(\w+)\s*\)/
  );
  if (forEachMatch) {
    return forEachMatch[1];
  }

  // Check for for...of loops
  const forOfMatch = beforePosition.match(/for\s*\(\s*.*?\s+of\s+(\w+)\s*\)/);
  if (forOfMatch) {
    return forOfMatch[1];
  }

  return null;
}

export function isInsideLoop(code: string, position: number): boolean {
  return detectLoopContext(code, position) !== null;
}

export function getLoopIndex(
  context: TestIdContext,
  loopVariable: string
): number {
  if (!context.loopIndices.has(loopVariable)) {
    context.loopIndices.set(loopVariable, 0);
  }
  const index = context.loopIndices.get(loopVariable)!;
  context.loopIndices.set(loopVariable, index + 1);
  return index;
}
