import { PluginOptions, TestIdContext } from "./types";
import { mergeOptions, shouldSkipElement, generateTestId } from "./utils";

export class FixedParser {
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
    // Use a simpler approach that tracks very basic parent-child relationships
    const lines = code.split("\n");
    let inLoop = false;
    let parentElement: string | null = null;

    const processedLines = lines.map((line) => {
      // Track loop context - simple detection
      if (/\.map\s*\(/.test(line)) {
        inLoop = true;
      }
      if (inLoop && /^\s*\)\s*[;,)\]\}]/.test(line)) {
        inLoop = false;
      }

      return this.processLineForJSX(line, context, inLoop, parentElement);
    });

    return processedLines.join("\n");
  }

  private processLineForJSX(
    line: string,
    context: TestIdContext,
    inLoop: boolean,
    parentElement: string | null
  ): string {
    // More careful JSX regex that ensures proper element boundaries
    const jsxRegex = /<([a-z][a-zA-Z0-9-]*)(\s[^>]*?)?(\s*\/?>)/g;

    let result = line;
    let offset = 0;

    let match;
    while ((match = jsxRegex.exec(line)) !== null) {
      const fullMatch = match[0];
      const elementName = match[1];
      const attributes = match[2] || "";
      const closing = match[3];
      const matchStart = match.index + offset;

      // Skip if this looks like TypeScript generic syntax
      if (this.isTypeScriptGeneric(line, match.index)) {
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

      // Generate test ID with very simple hierarchy (max 2 levels)
      const testId = this.generateTestId(
        elementName,
        context,
        inLoop,
        parentElement
      );
      if (!testId) {
        continue;
      }

      // Create replacement - be very careful about syntax
      let newAttributes;
      if (attributes.trim()) {
        // If there are existing attributes, ensure proper spacing
        const cleanAttributes = attributes.trim();
        newAttributes = ` ${cleanAttributes} ${testId}`;
      } else {
        // No existing attributes, just add the test ID
        newAttributes = ` ${testId}`;
      }

      const replacement = `<${elementName}${newAttributes}${closing}`;

      // Apply replacement
      const beforeMatch = result.substring(0, matchStart);
      const afterMatch = result.substring(matchStart + fullMatch.length);
      result = beforeMatch + replacement + afterMatch;

      // Update offset for next matches
      offset += replacement.length - fullMatch.length;
    }

    return result;
  }

  private isTypeScriptGeneric(line: string, position: number): boolean {
    // Check if this is a TypeScript generic like useState<string>
    const beforeMatch = line.substring(Math.max(0, position - 20), position);
    const afterMatch = line.substring(position, position + 50);

    // Look for common TypeScript generic patterns
    const isGeneric =
      /\w+\s*$/.test(beforeMatch) &&
      /^<[A-Z][a-zA-Z0-9\[\]|&,\s]*>/.test(afterMatch);

    return isGeneric;
  }

  private hasComplexAttributes(attributes: string): boolean {
    // Only skip if attributes have very complex patterns that would definitely break
    const complexPatterns = [
      /\{[^}]*=>[^}]*\{[^}]*\}[^}]*\}/, // Complex arrow functions with nested blocks
      /\{[^}]*\?[^}]*:[^}]*\}/, // Ternary operators
      /className\s*=\s*\{`[^`]*\$\{[^}]*\}[^`]*`\}/, // Template literals in className
    ];

    return complexPatterns.some((pattern) => pattern.test(attributes));
  }

  private generateTestId(
    elementName: string,
    context: TestIdContext,
    inLoop: boolean,
    parentElement: string | null
  ): string | null {
    const parts: string[] = [];

    // Add component name
    if (context.componentName) {
      parts.push(context.componentName);
    }

    // Add simple parent element if useHierarchy is enabled and we have one
    if (this.options.useHierarchy && parentElement) {
      parts.push(parentElement);
    }

    // Add current element
    if (this.options.includeElement) {
      parts.push(elementName);
    }

    const baseTestId = parts.join(this.options.separator);

    // Handle loop context
    if (inLoop) {
      return `data-testid={\`${baseTestId}.\${index}\`}`;
    }

    return `data-testid="${baseTestId}"`;
  }
}
