/**
 * Webpack loader to automatically inject data-testid attributes
 * Compatible with @pablohpsilva/data-testid-guidelines
 */

const babel = require("@babel/core");
const { createRequire } = require("module");

// Create a Babel plugin function that replicates our auto-testid logic
function createAutoTestIdPlugin(options = {}) {
  return function ({ types: t }) {
    let componentStack = [];
    let componentCounter = {};
    let loopContext = [];

    function getComponentName(path) {
      // Get component name from various contexts
      let current = path;
      while (current) {
        if (t.isVariableDeclarator(current.node) && current.node.id.name) {
          return current.node.id.name;
        }
        if (t.isFunctionDeclaration(current.node) && current.node.id) {
          return current.node.id.name;
        }
        if (
          t.isArrowFunctionExpression(current.node) &&
          current.parent &&
          t.isVariableDeclarator(current.parent) &&
          current.parent.id.name
        ) {
          return current.parent.id.name;
        }
        current = current.parentPath;
      }
      return null;
    }

    function getLoopContext(path) {
      // Check if we're inside a map call
      let current = path;
      while (current) {
        if (
          t.isCallExpression(current.node) &&
          t.isMemberExpression(current.node.callee) &&
          t.isIdentifier(current.node.callee.property) &&
          current.node.callee.property.name === "map"
        ) {
          // Try to get the array name
          let arrayName = "items";
          if (t.isIdentifier(current.node.callee.object)) {
            arrayName = current.node.callee.object.name;
          } else if (
            t.isMemberExpression(current.node.callee.object) &&
            t.isIdentifier(current.node.callee.object.property)
          ) {
            arrayName = current.node.callee.object.property.name;
          }

          // Get the index parameter name (usually 'index' or second parameter)
          let indexParam = "index";
          if (
            current.node.arguments[0] &&
            t.isArrowFunctionExpression(current.node.arguments[0])
          ) {
            const params = current.node.arguments[0].params;
            if (params.length >= 2 && t.isIdentifier(params[1])) {
              indexParam = params[1].name;
            } else if (params.length >= 1) {
              // Sometimes there's only one parameter but developers use destructuring
              // For now, let's default to 'index' but we might need to look for it in scope
              indexParam = "index";
            }
          } else if (
            current.node.arguments[0] &&
            t.isFunctionExpression(current.node.arguments[0])
          ) {
            const params = current.node.arguments[0].params;
            if (params.length >= 2 && t.isIdentifier(params[1])) {
              indexParam = params[1].name;
            }
          }

          return { arrayName, indexParam, path: current };
        }
        current = current.parentPath;
      }
      return null;
    }

    function generateTestId(elementName, componentName, path, options = {}) {
      const {
        separator = ".",
        includeElement = true,
        useHierarchy = true,
      } = options;

      let parts = [];

      if (useHierarchy && componentStack.length > 0) {
        parts = [...componentStack];
      }

      if (componentName) {
        parts.push(componentName);
      }

      // Check if we're in a loop context
      const loopCtx = getLoopContext(path);
      if (loopCtx) {
        // Add array name and "item" for loop items
        parts.push(loopCtx.arrayName);
        parts.push("item");

        // For loops, we need to return a template that includes the index
        // This will be handled differently in the JSXOpeningElement visitor
        return { parts, isLoop: true, indexParam: loopCtx.indexParam };
      } else if (includeElement && elementName !== componentName) {
        // For HTML elements, add element type (exclude only very basic elements)
        const excludeElements = [
          // Text formatting elements that are usually not meaningful for testing
          "b",
          "i",
          "em",
          "strong",
          "small",
          "mark",
          "del",
          "ins",
          "sub",
          "sup",
          // Line breaks and basic inline elements
          "br",
          "hr",
          "wbr",
          // Media elements that are usually identified by other attributes
          "img",
          "svg",
          "picture",
          "source",
          "audio",
          "video",
          "track",
          // Meta elements
          "meta",
          "link",
          "style",
          "script",
          "noscript",
          "template",
        ];

        if (!excludeElements.includes(elementName)) {
          parts.push(elementName);
        }
      }

      return parts.join(separator);
    }

    function shouldAddTestId(elementName, attributes, options = {}) {
      const { skipElements = ["br", "hr", "img"], onlyInteractive = false } =
        options;

      // Skip if already has data-testid
      const hasTestId = attributes.some(
        (attr) =>
          t.isJSXAttribute(attr) &&
          attr.name &&
          attr.name.name === "data-testid"
      );

      if (hasTestId) return false;

      // Skip certain elements
      if (skipElements.includes(elementName)) return false;

      // Only add to interactive elements if specified
      if (onlyInteractive) {
        const interactiveElements = [
          "button",
          "input",
          "select",
          "textarea",
          "a",
          "form",
        ];
        return interactiveElements.includes(elementName);
      }

      return true;
    }

    return {
      visitor: {
        // Track component function entries
        "FunctionDeclaration|ArrowFunctionExpression"(path) {
          const componentName = getComponentName(path);
          if (componentName && /^[A-Z]/.test(componentName)) {
            componentStack.push(componentName);
          }
        },

        // Track component exits
        "FunctionDeclaration|ArrowFunctionExpression": {
          exit(path) {
            const componentName = getComponentName(path);
            if (componentName && /^[A-Z]/.test(componentName)) {
              componentStack.pop();
            }
          },
        },

        JSXOpeningElement(path, state) {
          const { node } = path;
          const options = state.opts || {};

          // Get element name and attributes
          const elementName = node.name.name;
          const attributes = node.attributes;

          // Skip if no component context (avoid test IDs on elements with no component context)
          if (componentStack.length === 0) {
            return;
          }

          if (shouldAddTestId(elementName, attributes, options)) {
            const componentName = getComponentName(path);
            const testIdResult = generateTestId(
              elementName,
              componentName,
              path,
              options
            );

            if (testIdResult) {
              let testIdValue;

              // Check if it's a loop context
              if (typeof testIdResult === "object" && testIdResult.isLoop) {
                // Create a template literal for loop items with index
                const baseParts = testIdResult.parts.join(".");
                const indexParam = testIdResult.indexParam;

                // Create template literal: `${baseParts}.${indexParam}`
                testIdValue = t.templateLiteral(
                  [
                    t.templateElement({
                      raw: baseParts + ".",
                      cooked: baseParts + ".",
                    }),
                    t.templateElement({ raw: "", cooked: "" }),
                  ],
                  [t.identifier(indexParam)]
                );

                const testIdAttr = t.jsxAttribute(
                  t.jsxIdentifier("data-testid"),
                  t.jsxExpressionContainer(testIdValue)
                );

                node.attributes.push(testIdAttr);
              } else {
                // Static string literal
                testIdValue = t.stringLiteral(testIdResult);

                const testIdAttr = t.jsxAttribute(
                  t.jsxIdentifier("data-testid"),
                  testIdValue
                );

                node.attributes.push(testIdAttr);
              }
            }
          }
        },
      },
    };
  };
}

module.exports = function (source) {
  const options = this.getOptions() || {};

  // Only process .jsx, .tsx files, and files containing JSX
  const isJSX = /\.(jsx|tsx)$/.test(this.resourcePath) || /<\w+/.test(source);

  if (!isJSX) {
    return source;
  }

  // Only apply in development and test environments unless explicitly enabled
  const {
    enabled = process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test",
  } = options;

  if (!enabled) {
    return source;
  }

  try {
    // Transform the code with our Babel plugin
    const result = babel.transformSync(source, {
      filename: this.resourcePath,
      presets: [
        ["@babel/preset-react", { runtime: "automatic" }],
        ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
      ],
      plugins: [[createAutoTestIdPlugin(options), options]],
      configFile: false,
      babelrc: false,
      compact: false,
      sourceMaps: this.sourceMap,
    });

    if (result.map && this.sourceMap) {
      this.callback(null, result.code, result.map);
    } else {
      return result.code;
    }
  } catch (error) {
    // If transformation fails, return original source and log warning
    console.warn(
      `[webpack-auto-testid-loader] Failed to transform ${this.resourcePath}:`,
      error.message
    );
    return source;
  }
};
