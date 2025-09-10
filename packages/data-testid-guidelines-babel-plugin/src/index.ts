import { declare } from "@babel/helper-plugin-utils";
import { NodePath } from "@babel/core";
import * as t from "@babel/types";

export interface PluginOptions {
  /**
   * Custom attribute name instead of data-testid
   * @default 'data-testid'
   */
  attributeName?: string;

  /**
   * Whether to auto-generate test IDs for components
   * @default true
   */
  autoGenerate?: boolean;

  /**
   * Whether to skip components that already have testId
   * @default true
   */
  respectExisting?: boolean;
}

interface LoopContext {
  indexParam: string; // The index parameter name (e.g., 'index')
  componentName: string; // The component being rendered in the loop
  isWithinLoop: boolean; // Whether we're currently inside a loop
}

const defaultOptions: Required<PluginOptions> = {
  attributeName: "data-testid",
  autoGenerate: true,
  respectExisting: true,
};

const dataTestIdGuidelinesPlugin = declare<PluginOptions>(
  (api: any, options: PluginOptions) => {
    api.assertVersion(7);

    const opts = { ...defaultOptions, ...options };

    return {
      name: "data-testid-guidelines",
      visitor: {
        Program: {
          enter(_path: NodePath<t.Program>, state: any) {
            // Initialize plugin state
            state.componentStack = [];
            state.currentComponent = "";
            state.loopContexts = [];
            state.opts = opts;
          },
        },

        // Track function components
        FunctionDeclaration: {
          enter(path: NodePath<t.FunctionDeclaration>, state: any) {
            const componentName = getComponentName(path);
            if (componentName && isReactComponent(path)) {
              state.componentStack.push(componentName);
              state.currentComponent = componentName;
            }
          },
          exit(path: NodePath<t.FunctionDeclaration>, state: any) {
            const componentName = getComponentName(path);
            if (componentName && isReactComponent(path)) {
              state.componentStack.pop();
              state.currentComponent =
                state.componentStack[state.componentStack.length - 1] || "";
            }
          },
        },

        ArrowFunctionExpression: {
          enter(path: NodePath<t.ArrowFunctionExpression>, state: any) {
            const componentName = getComponentName(path);
            if (componentName && isReactComponent(path)) {
              state.componentStack.push(componentName);
              state.currentComponent = componentName;
            }
          },
          exit(path: NodePath<t.ArrowFunctionExpression>, state: any) {
            const componentName = getComponentName(path);
            if (componentName && isReactComponent(path)) {
              state.componentStack.pop();
              state.currentComponent =
                state.componentStack[state.componentStack.length - 1] || "";
            }
          },
        },

        FunctionExpression: {
          enter(path: NodePath<t.FunctionExpression>, state: any) {
            const componentName = getComponentName(path);
            if (componentName && isReactComponent(path)) {
              state.componentStack.push(componentName);
              state.currentComponent = componentName;
            }
          },
          exit(path: NodePath<t.FunctionExpression>, state: any) {
            const componentName = getComponentName(path);
            if (componentName && isReactComponent(path)) {
              state.componentStack.pop();
              state.currentComponent =
                state.componentStack[state.componentStack.length - 1] || "";
            }
          },
        },

        // Track loop contexts (map, forEach, etc.)
        CallExpression: {
          enter(path: NodePath<t.CallExpression>, state: any) {
            if (isArrayIterationMethod(path)) {
              const loopContext = extractLoopContext(path);
              if (loopContext) {
                state.loopContexts.push(loopContext);
              }
            }
          },
          exit(path: NodePath<t.CallExpression>, state: any) {
            if (isArrayIterationMethod(path)) {
              state.loopContexts.pop();
            }
          },
        },

        // Process JSX elements
        JSXElement(path: NodePath<t.JSXElement>, state: any) {
          processJSXElement(path, state);
        },
      },
    };
  }
);

function getComponentName(path: NodePath<t.Function>): string | null {
  // Function declaration: function MyComponent() {}
  if (t.isFunctionDeclaration(path.node) && path.node.id) {
    return path.node.id.name;
  }

  // Arrow function or function expression: const MyComponent = () => {}
  const parent = path.parent;
  if (t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) {
    return parent.id.name;
  }

  // Property in object: { MyComponent: () => {} }
  if (t.isObjectProperty(parent) && t.isIdentifier(parent.key)) {
    return parent.key.name;
  }

  // Assignment: MyComponent = () => {}
  if (t.isAssignmentExpression(parent) && t.isIdentifier(parent.left)) {
    return parent.left.name;
  }

  return null;
}

function isReactComponent(path: NodePath<t.Function>): boolean {
  // For arrow functions with expression body (no return statement)
  if (t.isArrowFunctionExpression(path.node) && path.node.body) {
    if (t.isJSXElement(path.node.body) || t.isJSXFragment(path.node.body)) {
      return true;
    }
  }

  // Check if function returns JSX
  let returnsJSX = false;

  path.traverse({
    ReturnStatement(returnPath) {
      if (returnPath.node.argument) {
        if (
          t.isJSXElement(returnPath.node.argument) ||
          t.isJSXFragment(returnPath.node.argument)
        ) {
          returnsJSX = true;
        }
      }
    },
  });

  return returnsJSX;
}

function isArrayIterationMethod(path: NodePath<t.CallExpression>): boolean {
  const callee = path.node.callee;
  if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
    const methodName = callee.property.name;
    return ["map", "forEach", "filter", "reduce"].includes(methodName);
  }
  return false;
}

function extractLoopContext(
  path: NodePath<t.CallExpression>
): LoopContext | null {
  const args = path.node.arguments;
  if (args.length === 0) return null;

  const callback = args[0];

  // Handle arrow functions: (item, index) => ... or (item) => ...
  if (t.isArrowFunctionExpression(callback)) {
    const params = callback.params;
    // If there's an explicit index parameter, use it
    if (params.length >= 2 && t.isIdentifier(params[1])) {
      return {
        indexParam: params[1].name,
        componentName: "", // Will be filled when processing JSX
        isWithinLoop: true,
      };
    }
    // If there's only one parameter, still treat as loop but use 'index' as default
    else if (params.length >= 1) {
      return {
        indexParam: "index", // Default index parameter name
        componentName: "", // Will be filled when processing JSX
        isWithinLoop: true,
      };
    }
  }

  // Handle function expressions: function(item, index) { ... } or function(item) { ... }
  if (t.isFunctionExpression(callback)) {
    const params = callback.params;
    // If there's an explicit index parameter, use it
    if (params.length >= 2 && t.isIdentifier(params[1])) {
      return {
        indexParam: params[1].name,
        componentName: "", // Will be filled when processing JSX
        isWithinLoop: true,
      };
    }
    // If there's only one parameter, still treat as loop but use 'index' as default
    else if (params.length >= 1) {
      return {
        indexParam: "index", // Default index parameter name
        componentName: "", // Will be filled when processing JSX
        isWithinLoop: true,
      };
    }
  }

  return null;
}

function processJSXElement(path: NodePath<t.JSXElement>, state: any) {
  const openingElement = path.node.openingElement;

  if (!t.isJSXIdentifier(openingElement.name)) {
    return;
  }

  const elementName = openingElement.name.name;
  const isComponent = isUpperCase(elementName.charAt(0));
  const isDOMElement = !isComponent;

  // Skip if auto-generation is disabled
  if (!state.opts.autoGenerate) {
    return;
  }

  // Skip if element already has the attribute and we respect existing
  if (
    state.opts.respectExisting &&
    hasTestIdAttribute(openingElement, state.opts.attributeName)
  ) {
    return;
  }

  // Process React components (uppercase)
  if (isComponent) {
    const testIdInfo = generateTestIdForComponent(elementName, state);
    if (testIdInfo) {
      const isInLoop = state.loopContexts.length > 0;
      const indexParam = isInLoop
        ? state.loopContexts[state.loopContexts.length - 1].indexParam
        : undefined;
      addTestIdAttribute(
        openingElement,
        state.opts.attributeName,
        testIdInfo,
        isInLoop,
        indexParam
      );
    }
  }
  // Process root DOM elements only
  else if (isDOMElement && isRootDOMElement(path, state)) {
    const testId = state.currentComponent;
    if (testId) {
      addTestIdAttribute(openingElement, state.opts.attributeName, testId);
    }
  }
}

function generateTestIdForComponent(
  componentName: string,
  state: any
): string | null {
  const componentStack = state.componentStack || [];

  if (componentStack.length === 0) {
    return componentName;
  }

  // Build the full hierarchy
  const hierarchy = componentStack.join(".");
  const isInLoop = state.loopContexts.length > 0;

  if (isInLoop) {
    // For components in loops, generate expression that uses the index parameter
    const indexParam =
      state.loopContexts[state.loopContexts.length - 1].indexParam;
    return `${hierarchy}.${componentName}.\${${indexParam}}`;
  } else {
    // For regular nested components: Parent.Component
    return `${hierarchy}.${componentName}`;
  }
}

function isRootDOMElement(path: NodePath<t.JSXElement>, _state: any): boolean {
  // Check if this DOM element is the root return of a component
  let current: t.Node | null = path.parent;

  // Look for return statement
  while (current) {
    if (t.isReturnStatement(current)) {
      return true;
    }

    // If we encounter another JSX element, this is not root
    if (t.isJSXElement(current)) {
      return false;
    }

    // Skip through parentheses, expressions, etc.
    if (
      t.isParenthesizedExpression(current) ||
      t.isJSXExpressionContainer(current)
    ) {
      current = path.parentPath?.parent || null;
      continue;
    }

    break;
  }

  return false;
}

function hasTestIdAttribute(
  openingElement: t.JSXOpeningElement,
  attributeName: string
): boolean {
  return openingElement.attributes.some(
    (attr: t.JSXAttribute | t.JSXSpreadAttribute) => {
      return (
        t.isJSXAttribute(attr) &&
        t.isJSXIdentifier(attr.name) &&
        attr.name.name === attributeName
      );
    }
  );
}

function addTestIdAttribute(
  openingElement: t.JSXOpeningElement,
  attributeName: string,
  value: string,
  isTemplate: boolean = false,
  indexParam?: string
): void {
  let attributeValue: t.JSXExpressionContainer | t.StringLiteral;

  if (isTemplate && indexParam) {
    // Create template literal for loop contexts: `Parent.Component.${index}`
    const parts = value.split(`\${${indexParam}}`);
    const quasis = parts.map((part, index) =>
      t.templateElement({ raw: part, cooked: part }, index === parts.length - 1)
    );
    const expressions = parts.length > 1 ? [t.identifier(indexParam)] : [];

    const templateLiteral = t.templateLiteral(quasis, expressions);
    attributeValue = t.jsxExpressionContainer(templateLiteral);
  } else {
    // Regular string literal
    attributeValue = t.stringLiteral(value);
  }

  const testIdAttribute = t.jsxAttribute(
    t.jsxIdentifier(attributeName),
    attributeValue
  );

  openingElement.attributes.push(testIdAttribute);
}

function isUpperCase(char: string): boolean {
  return char === char.toUpperCase() && char !== char.toLowerCase();
}

export default dataTestIdGuidelinesPlugin;
