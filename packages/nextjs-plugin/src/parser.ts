import { PluginOptions, TestIdContext } from "./types";
import { mergeOptions, shouldSkipElement, generateTestId } from "./utils";

export class SimpleJSXParser {
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

    // Process JSX elements using a more careful approach
    return this.processJSXElements(code, context);
  }

  private extractComponentName(code: string): string | null {
    // Look for export function declarations first
    const exportFunctionMatch = code.match(
      /export\s+(?:default\s+)?function\s+(\w+)/
    );
    if (exportFunctionMatch) {
      return exportFunctionMatch[1];
    }

    // Look for export const arrow functions
    const exportArrowMatch = code.match(
      /export\s+(?:default\s+)?const\s+(\w+)\s*=\s*\(/
    );
    if (exportArrowMatch) {
      return exportArrowMatch[1];
    }

    // Look for regular function declarations
    const functionMatch = code.match(/function\s+(\w+)/);
    if (functionMatch) {
      return functionMatch[1];
    }

    // Look for const declarations with functions
    const constMatch = code.match(/const\s+(\w+)\s*=\s*(?:function|\()/);
    if (constMatch) {
      return constMatch[1];
    }

    return null;
  }

  private processJSXElements(code: string, context: TestIdContext): string {
    // Go back to the line-by-line approach but with better multi-line element handling
    return this.processCodeWithHierarchy(code, context);
  }

  private detectLoopRanges(
    code: string
  ): Array<{ start: number; end: number }> {
    const ranges: Array<{ start: number; end: number }> = [];
    const lines = code.split("\n");
    let position = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/\.(map|forEach)\s*\(/.test(line)) {
        const start = position;
        // Find the end of this loop by looking for the closing
        let end = start + line.length;
        for (let j = i + 1; j < lines.length; j++) {
          end += lines[j].length + 1;
          if (lines[j].includes("})}") || lines[j].includes(")}</")) {
            break;
          }
        }
        ranges.push({ start, end });
      }

      position += line.length + 1;
    }

    return ranges;
  }

  private processCodeWithLoopContext(
    code: string,
    context: TestIdContext,
    loopRanges: Array<{ start: number; end: number }>
  ): string {
    // More careful regex that avoids matching inside attribute values
    const jsxElementRegex =
      /<([a-z][a-zA-Z0-9-]*)((?:\s+[^=>\s]+(?:=(?:"[^"]*"|'[^']*'|{[^}]*}))?)*)\s*(\/?>|>)/g;
    const matches: Array<{
      index: number;
      length: number;
      replacement: string;
    }> = [];
    const loopCounters = new Map<string, number>();

    let match: RegExpExecArray | null;
    while ((match = jsxElementRegex.exec(code)) !== null) {
      const elementName = match[1];
      const attributes = match[2] || "";
      const closingPart = match[3];
      const fullMatch = match[0];

      // Skip if element should be skipped
      if (this.shouldSkipElement(elementName)) {
        continue;
      }

      // Skip if already has data-testid
      if (attributes.includes("data-testid")) {
        continue;
      }

      // Skip React components (starting with uppercase)
      if (/^[A-Z]/.test(elementName)) {
        continue;
      }

      // Check if this element is inside a loop
      const isInLoop = loopRanges.some(
        (range) => match!.index >= range.start && match!.index <= range.end
      );

      // Generate test ID
      const testId = this.buildHierarchicalTestId(
        elementName,
        context,
        code,
        match!.index,
        loopCounters,
        isInLoop,
        0
      );

      if (testId) {
        // Create new element with data-testid
        let newElement: string;

        const finalTestId = isInLoop
          ? this.makeDynamicTestId(testId, context, code)
          : `"${testId}"`;

        if (attributes.trim()) {
          if (isInLoop) {
            newElement = `<${elementName} ${attributes} data-testid={${finalTestId}}${closingPart}`;
          } else {
            newElement = `<${elementName} ${attributes} data-testid=${finalTestId}${closingPart}`;
          }
        } else {
          if (isInLoop) {
            newElement = `<${elementName} data-testid={${finalTestId}}${closingPart}`;
          } else {
            newElement = `<${elementName} data-testid=${finalTestId}${closingPart}`;
          }
        }

        matches.push({
          index: match!.index,
          length: fullMatch.length,
          replacement: newElement,
        });
      }
    }

    // Apply replacements in reverse order to maintain correct positions
    let result = code;
    matches.reverse().forEach(({ index, length, replacement }) => {
      result =
        result.substring(0, index) +
        replacement +
        result.substring(index + length);
    });

    // Post-processing: add test IDs to missed button elements
    result = this.addMissedButtonTestIds(result, context, loopRanges);

    return result;
  }

  private addMissedButtonTestIds(
    code: string,
    context: TestIdContext,
    loopRanges: Array<{ start: number; end: number }>
  ): string {
    // Look for button elements that don't have data-testid (including multi-line)
    const buttonRegex = /<button\s+([^>]*?)>/gs;
    const matches: Array<{
      index: number;
      length: number;
      replacement: string;
    }> = [];

    let match: RegExpExecArray | null;
    while ((match = buttonRegex.exec(code)) !== null) {
      const attributes = match[1];
      const fullMatch = match[0];

      // Skip if already has data-testid
      if (attributes.includes("data-testid")) {
        continue;
      }

      // Check if this element is inside a loop
      const isInLoop = loopRanges.some(
        (range) => match!.index >= range.start && match!.index <= range.end
      );

      // Generate test ID for the button
      const testId = this.buildHierarchicalTestId(
        "button",
        context,
        code,
        match!.index,
        new Map(),
        isInLoop,
        0
      );

      if (testId) {
        const finalTestId = isInLoop
          ? this.makeDynamicTestId(testId, context, code)
          : `"${testId}"`;

        let newElement: string;
        if (isInLoop) {
          newElement = `<button ${attributes} data-testid={${finalTestId}}>`;
        } else {
          newElement = `<button ${attributes} data-testid=${finalTestId}>`;
        }

        matches.push({
          index: match!.index,
          length: fullMatch.length,
          replacement: newElement,
        });
      }
    }

    // Apply button replacements
    let result = code;
    matches.reverse().forEach(({ index, length, replacement }) => {
      result =
        result.substring(0, index) +
        replacement +
        result.substring(index + length);
    });

    return result;
  }

  private processCodeWithHierarchy(
    code: string,
    context: TestIdContext
  ): string {
    // Track processed elements and hierarchy
    const elementStack: string[] = [];
    const loopCounters = new Map<string, number>();

    // Process line by line to avoid issues with complex JSX expressions
    const lines = code.split("\n");
    const processedLines: string[] = [];

    // Track if we're inside a loop context and cumulative position
    let insideLoop = false;
    let loopDepth = 0;
    let currentLoopIteration = 0;
    let cumulativePosition = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if this line starts or ends a loop
      const loopInfo = this.analyzeLineForLoop(line);
      if (loopInfo.startsLoop) {
        insideLoop = true;
        loopDepth++;
        currentLoopIteration = 0;
        // Clear counters when starting a new loop
        loopCounters.clear();
      }
      if (loopInfo.endsLoop) {
        loopDepth--;
        if (loopDepth <= 0) {
          insideLoop = false;
          loopDepth = 0;
          currentLoopIteration = 0;
          // Reset loop counters when exiting all loops
          loopCounters.clear();
        }
      }

      // For static analysis, we can't detect actual iterations
      // Instead, we'll use a placeholder approach for the first element in a loop

      const processedLine = this.processJSXLine(
        line,
        context,
        loopCounters,
        insideLoop,
        currentLoopIteration,
        code,
        cumulativePosition
      );
      processedLines.push(processedLine);

      // Update cumulative position for next line
      cumulativePosition += line.length + 1; // +1 for the newline character
    }

    return processedLines.join("\n");
  }

  private processJSXLine(
    line: string,
    context: TestIdContext,
    loopCounters: Map<string, number>,
    insideLoop: boolean,
    currentLoopIteration: number,
    fullCode: string,
    lineStartPosition: number
  ): string {
    // Look for JSX opening tags, especially those that might span multiple lines
    const simpleJSXRegex = /(<([a-z][a-zA-Z0-9-]*)\s*)([^>]*?)(\/?>|>)/g;

    let result = line;
    let offset = 0;

    let match;
    while ((match = simpleJSXRegex.exec(line)) !== null) {
      const openingPart = match[1]; // "<element "
      const elementName = match[2]; // "element"
      const attributes = match[3] || ""; // attributes
      const closingPart = match[4]; // ">" or "/>"
      const fullMatch = match[0];

      // Skip if line contains JavaScript expressions that might be problematic
      // But be more permissive to allow buttons and other interactive elements
      if (
        this.lineContainsProblematicJS(line, match.index) &&
        elementName !== "button"
      ) {
        continue;
      }

      // Skip if element should be skipped
      if (this.shouldSkipElement(elementName)) {
        continue;
      }

      // Skip if already has data-testid
      if (attributes.includes("data-testid")) {
        continue;
      }

      // Build test ID with hierarchy
      const testId = this.buildHierarchicalTestId(
        elementName,
        context,
        fullCode,
        lineStartPosition + (match.index || 0),
        loopCounters,
        insideLoop,
        currentLoopIteration
      );

      if (testId) {
        // Create new element with data-testid
        let newElement: string;

        // If we're inside a loop, we need to make the test ID dynamic
        const finalTestId = insideLoop
          ? this.makeDynamicTestId(testId, context, fullCode)
          : `"${testId}"`;

        if (attributes.trim()) {
          if (insideLoop) {
            newElement = `${openingPart}${attributes} data-testid={${finalTestId}}${closingPart}`;
          } else {
            newElement = `${openingPart}${attributes} data-testid=${finalTestId}${closingPart}`;
          }
        } else {
          if (insideLoop) {
            newElement = `${openingPart} data-testid={${finalTestId}}${closingPart}`;
          } else {
            newElement = `${openingPart} data-testid=${finalTestId}${closingPart}`;
          }
        }

        // Replace in the result with proper offset tracking
        const matchStart = match.index + offset;
        const matchEnd = matchStart + fullMatch.length;
        result =
          result.substring(0, matchStart) +
          newElement +
          result.substring(matchEnd);

        // Update offset for subsequent matches
        offset += newElement.length - fullMatch.length;
      }
    }

    return result;
  }

  private lineContainsProblematicJS(line: string, position: number): boolean {
    // Check if this line contains arrow functions or other JS that might break
    const beforeMatch = line.substring(0, position);
    const afterMatch = line.substring(position);

    // Only skip if the JSX element itself has problematic attributes
    const elementMatch = line.match(/<[a-z][a-zA-Z0-9-]*\s*([^>]*)/);
    if (elementMatch) {
      const elementAttributes = elementMatch[1];

      // Be more permissive - only skip truly problematic cases
      // Allow most elements, even with complex attributes
      if (
        elementAttributes.includes("onClick={() =>") &&
        elementAttributes.includes("className={`")
      ) {
        // Only skip if element has BOTH complex onClick AND complex className
        return true;
      }
    }

    // Allow simple elements even if the line contains => elsewhere (like in map functions)

    return false;
  }

  private analyzeLineForLoop(line: string): {
    startsLoop: boolean;
    endsLoop: boolean;
  } {
    const startsLoop =
      /\.(map|forEach)\s*\(/.test(line) || /for\s*\(.*of/.test(line);
    // Be more specific about loop endings - look for the closing of the map function
    const endsLoop = line.includes("})}") || line.includes(")}</");

    return { startsLoop, endsLoop };
  }

  private isNewLoopIteration(
    line: string,
    lineIndex: number,
    allLines: string[]
  ): boolean {
    // Look for patterns that indicate a new iteration in a loop
    // This is typically the first JSX element after the loop starts
    const trimmedLine = line.trim();

    // If this line contains the opening tag of a loop item (like <li> in a map)
    if (trimmedLine.match(/^\s*<[a-z][a-zA-Z0-9-]*\s/)) {
      // Check if the previous lines suggest this is a new iteration
      // Look back a few lines to see if we just had a closing tag
      for (let i = Math.max(0, lineIndex - 3); i < lineIndex; i++) {
        const prevLine = allLines[i].trim();
        if (prevLine.includes("</") || prevLine.includes(")}")) {
          return true;
        }
      }
    }

    return false;
  }

  private makeDynamicTestId(
    testId: string,
    context: TestIdContext,
    code: string
  ): string {
    // Find the loop index variable from the surrounding code
    const indexVar = this.extractLoopIndexVariable(code);

    if (indexVar === null) {
      // No index variable available, use a fallback approach
      // For loops without index, we can use the item's unique property
      const dynamicTestId = testId.replace(
        "INDEX_PLACEHOLDER",
        "${tab.id || 'item'}"
      );
      return "`" + dynamicTestId + "`";
    }

    // Replace the placeholder with the actual index variable
    const dynamicTestId = testId.replace(
      "INDEX_PLACEHOLDER",
      "${" + indexVar + "}"
    );

    // Return as a template literal
    return "`" + dynamicTestId + "`";
  }

  private extractLoopIndexVariable(code: string): string | null {
    // Look for the loop index variable in the map function
    const mapMatch = code.match(/\.map\s*\(\s*\([^,]+,\s*([^)]+)\s*\)/);
    if (mapMatch) {
      return mapMatch[1].trim();
    }

    // Look for forEach patterns
    const forEachMatch = code.match(/\.forEach\s*\(\s*\([^,]+,\s*([^)]+)\s*\)/);
    if (forEachMatch) {
      return forEachMatch[1].trim();
    }

    // Look for single parameter loops (no index variable)
    const singleParamMatch = code.match(/\.map\s*\(\s*\([^,)]+\s*\)/);
    if (singleParamMatch) {
      return null; // No index variable available
    }

    // Default to 'index' which is the most common
    return "index";
  }

  private shouldSkipElement(elementName: string): boolean {
    return shouldSkipElement(elementName, this.options);
  }

  private buildHierarchicalTestId(
    elementName: string,
    context: TestIdContext,
    code: string,
    position: number,
    loopCounters: Map<string, number>,
    insideLoop: boolean,
    currentLoopIteration: number
  ): string | null {
    const parts: string[] = [];

    // Add component name
    if (context.componentName) {
      parts.push(context.componentName);
    }

    // Enhanced hierarchy detection: find direct parent element
    const parentElement = this.findDirectParent(code, position);
    if (parentElement && !this.shouldSkipElement(parentElement)) {
      parts.push(parentElement);
    }

    // Add current element
    if (this.options.includeElement) {
      parts.push(elementName);
    }

    // Check if we're inside a loop and add placeholder for dynamic index
    if (insideLoop) {
      // We'll replace this placeholder with the actual index variable later
      parts.push("INDEX_PLACEHOLDER");
    }

    return parts.join(this.options.separator);
  }

  private findDirectParent(code: string, position: number): string | null {
    // Look backwards from position to find the most recent opening tag
    const beforeCode = code.substring(0, position);

    // Find all opening tags before this position, excluding self-closing ones
    const openingTags = [];
    const tagRegex = /<([a-z][a-zA-Z0-9-]*)[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(beforeCode)) !== null) {
      const tagName = match[1];
      const fullTag = match[0];

      // Skip self-closing tags and React components
      if (!fullTag.includes("/>") && !/^[A-Z]/.test(tagName)) {
        openingTags.push(tagName);
      }
    }

    // Also check for closing tags to remove them from the stack
    const closingTags = beforeCode.match(/<\/([a-z][a-zA-Z0-9-]*)/g) || [];

    // Build a simple stack to find the actual parent
    const elementStack = [...openingTags];
    closingTags.forEach((closeTag) => {
      const tagName = closeTag.substring(2); // Remove '</'
      const lastIndex = elementStack.lastIndexOf(tagName);
      if (lastIndex !== -1) {
        elementStack.splice(lastIndex, 1);
      }
    });

    // Return the last unclosed tag (direct parent)
    return elementStack.length > 0
      ? elementStack[elementStack.length - 1]
      : null;
  }

  private detectLoopContext(code: string, position: number): boolean {
    // Look for .map, .forEach, for loops, etc. around the current position
    const beforePosition = code.substring(
      Math.max(0, position - 300),
      position
    );

    // Check for .map() calls
    if (beforePosition.match(/\w+\.map\s*\(\s*\(/)) {
      return true;
    }

    // Check for .forEach() calls
    if (beforePosition.match(/\w+\.forEach\s*\(\s*\(/)) {
      return true;
    }

    // Check for for...of loops
    if (beforePosition.match(/for\s*\(\s*.*?\s+of\s+\w+\s*\)/)) {
      return true;
    }

    return false;
  }
}
