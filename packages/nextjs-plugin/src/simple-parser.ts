import { PluginOptions, TestIdContext } from "./types";
import { mergeOptions, shouldSkipElement, generateTestId } from "./utils";

export class SimpleReliableParser {
  private options: Required<PluginOptions>;

  constructor(options: PluginOptions = {}) {
    this.options = mergeOptions(options);
  }

  transform(code: string, filename: string): string {
    if (!this.options.enabled) {
      return code;
    }

    // Skip non-React files
    if (!this.isReactFile(code)) {
      return code;
    }

    return this.processCode(code, filename);
  }

  private isReactFile(code: string): boolean {
    // Check for React imports or JSX syntax
    return (
      /import.*from\s+['"]react['"]/.test(code) ||
      /import.*React/.test(code) ||
      /<[a-zA-Z]/.test(code) ||
      /export\s+(?:default\s+)?function\s+\w+/.test(code) ||
      /const\s+\w+\s*=\s*\(/.test(code)
    );
  }

  private processCode(code: string, filename: string): string {
    const context: TestIdContext = {
      hierarchy: [],
      loopIndices: new Map(),
      elementCounts: new Map(),
    };

    // Find component function to extract name
    const componentName = this.extractComponentName(code);
    if (componentName) {
      context.componentName = componentName;
    }

    // Use a much simpler approach - find JSX elements and add test IDs
    return this.addTestIdsToJSX(code, context);
  }

  private extractComponentName(code: string): string | undefined {
    // Try different patterns to extract component name
    const patterns = [
      /export\s+(?:default\s+)?function\s+([A-Z][a-zA-Z0-9]*)/,
      /export\s+const\s+([A-Z][a-zA-Z0-9]*)\s*=\s*\(/,
      /const\s+([A-Z][a-zA-Z0-9]*)\s*=\s*function/,
      /function\s+([A-Z][a-zA-Z0-9]*)\s*\(/,
    ];

    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return undefined;
  }

  private addTestIdsToJSX(code: string, context: TestIdContext): string {
    // Simple approach: find JSX opening tags and add test IDs
    // Use a very conservative regex that only matches clear JSX elements
    const jsxRegex = /<([a-z][a-zA-Z0-9-]*)\s*([^>]*?)(\s*\/?>)/g;

    let result = code;
    const replacements: Array<{
      start: number;
      end: number;
      replacement: string;
    }> = [];

    let match;
    while ((match = jsxRegex.exec(code)) !== null) {
      const fullMatch = match[0];
      const elementName = match[1];
      const attributes = match[2] || "";
      const closing = match[3];
      const matchStart = match.index;
      const matchEnd = matchStart + fullMatch.length;

      // Skip if this looks like TypeScript generic syntax
      if (this.isTypeScriptGeneric(code, matchStart)) {
        continue;
      }

      // Skip if element should be skipped
      if (shouldSkipElement(elementName, this.options)) {
        continue;
      }

      // Skip if already has data-testid
      if (attributes.includes("data-testid")) {
        continue;
      }

      // Skip if attributes contain complex JavaScript that might break
      if (this.hasComplexAttributes(attributes)) {
        continue;
      }

      // Generate test ID
      const testId = this.generateSimpleTestId(elementName, context);
      if (!testId) {
        continue;
      }

      // Create replacement
      const newAttributes = attributes.trim()
        ? `${attributes} data-testid="${testId}"`
        : ` data-testid="${testId}"`;

      const replacement = `<${elementName}${newAttributes}${closing}`;

      replacements.push({
        start: matchStart,
        end: matchEnd,
        replacement,
      });
    }

    // Apply replacements in reverse order to maintain positions
    replacements.reverse().forEach(({ start, end, replacement }) => {
      result = result.substring(0, start) + replacement + result.substring(end);
    });

    return result;
  }

  private isTypeScriptGeneric(code: string, position: number): boolean {
    // Check if this is a TypeScript generic like useState<string> or Record<string, any>
    const beforeMatch = code.substring(Math.max(0, position - 30), position);
    const afterMatch = code.substring(position, position + 100);

    // Look for common TypeScript generic patterns
    const genericPatterns = [
      // Hook patterns
      /useState\s*$/,
      /useRef\s*$/,
      /useCallback\s*$/,
      /useMemo\s*$/,
      /useEffect\s*$/,
      /useReducer\s*$/,
      // Type patterns
      /Record\s*$/,
      /Array\s*$/,
      /Promise\s*$/,
      /Map\s*$/,
      /Set\s*$/,
      /Partial\s*$/,
      /Required\s*$/,
      /Pick\s*$/,
      /Omit\s*$/,
      // Function/interface patterns
      /function\s+\w+\s*$/,
      /interface\s+\w+\s*$/,
      /type\s+\w+\s*$/,
      /extends\s+\w+\s*$/,
      /:\s*\w+\s*$/,
      // Generic function calls or type annotations
      /\w+\s*$/,
    ];

    const isAfterGenericPattern = genericPatterns.some(pattern => pattern.test(beforeMatch));
    
    // Check if what follows looks like a TypeScript generic (starts with uppercase or contains brackets/unions)
    const isGenericSyntax = /^<[A-Za-z0-9\[\]|&,\s\{\}:;<>\.]*>/.test(afterMatch);

    return isAfterGenericPattern && isGenericSyntax;
  }

  private hasComplexAttributes(attributes: string): boolean {
    // Only skip if attributes have very complex patterns that would definitely break
    const complexPatterns = [
      /\{[^}]*=>[^}]*\{[^}]*\}[^}]*\}/, // Complex arrow functions with blocks
      /\{[^}]*\?[^}]*:[^}]*\}/, // Ternary operators
      /className\s*=\s*\{`[^`]*\$\{[^}]*\}[^`]*`\}/, // Template literals
    ];

    return complexPatterns.some((pattern) => pattern.test(attributes));
  }

  private generateSimpleTestId(
    elementName: string,
    context: TestIdContext
  ): string | null {
    // For now, just use simple component.element format
    // We can enhance this later with hierarchy if needed
    return generateTestId(elementName, context, this.options);
  }
}
