const babel = require("@babel/core");

// Test source code (similar to Navigation.tsx)
const testSource = `
export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "users", label: "Users", icon: "👥" },
    { id: "products", label: "Products", icon: "🛍️" },
  ];

  return (
    <nav>
      <ul>
        {tabs.map((tab, index) => (
          <li key={tab.id}>
            <button onClick={() => onTabChange(tab.id)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
`;

// Import our Babel plugin logic
const { createRequire } = require("module");

// Create the same plugin function as in the loader
function createAutoTestIdPlugin(options = {}) {
  return function ({ types: t }) {
    let componentStack = [];

    function getComponentName(path) {
      // Direct function declaration
      if (t.isFunctionDeclaration(path.node) && path.node.id) {
        return path.node.id.name;
      }

      // Export named declaration with function
      if (
        t.isExportNamedDeclaration(path.node) &&
        t.isFunctionDeclaration(path.node.declaration) &&
        path.node.declaration.id
      ) {
        return path.node.declaration.id.name;
      }

      return null;
    }

    function shouldAddTestId(elementName, attributes) {
      // Skip if already has data-testid
      const hasTestId = attributes.some(
        (attr) =>
          t.isJSXAttribute(attr) &&
          attr.name &&
          attr.name.name === "data-testid"
      );
      return !hasTestId;
    }

    return {
      visitor: {
        ExportNamedDeclaration(path) {
          const componentName = getComponentName(path);
          console.log(`Found export: ${componentName} in ${path.node.type}`);
          if (componentName && /^[A-Z]/.test(componentName)) {
            console.log(`Adding to stack: ${componentName}`);
            componentStack.push(componentName);

            // Process children
            path.traverse({
              JSXOpeningElement(innerPath) {
                const { node } = innerPath;
                const elementName = node.name.name;
                const attributes = node.attributes;

                console.log(
                  `JSX element: ${elementName}, stack: [${componentStack.join(
                    ", "
                  )}]`
                );

                if (shouldAddTestId(elementName, attributes)) {
                  const testId = `${
                    componentStack[componentStack.length - 1]
                  }.${elementName}`;
                  console.log(`Adding test ID: ${testId}`);

                  const testIdAttr = t.jsxAttribute(
                    t.jsxIdentifier("data-testid"),
                    t.stringLiteral(testId)
                  );

                  node.attributes.push(testIdAttr);
                }
              },
            });

            console.log(`Removing from stack: ${componentName}`);
            componentStack.pop();
          }
        },

        FunctionDeclaration(path) {
          const componentName = getComponentName(path);
          console.log(`Found function: ${componentName} in ${path.node.type}`);
          if (componentName && /^[A-Z]/.test(componentName)) {
            console.log(`Adding to stack: ${componentName}`);
            componentStack.push(componentName);

            // Process children
            path.traverse({
              JSXOpeningElement(innerPath) {
                const { node } = innerPath;
                const elementName = node.name.name;
                const attributes = node.attributes;

                console.log(
                  `JSX element: ${elementName}, stack: [${componentStack.join(
                    ", "
                  )}]`
                );

                if (shouldAddTestId(elementName, attributes)) {
                  const testId = `${
                    componentStack[componentStack.length - 1]
                  }.${elementName}`;
                  console.log(`Adding test ID: ${testId}`);

                  const testIdAttr = t.jsxAttribute(
                    t.jsxIdentifier("data-testid"),
                    t.stringLiteral(testId)
                  );

                  node.attributes.push(testIdAttr);
                }
              },
            });

            console.log(`Removing from stack: ${componentName}`);
            componentStack.pop();
          }
        },
      },
    };
  };
}

// Test the plugin
try {
  console.log("=== Testing Babel Plugin ===");
  console.log("Source:");
  console.log(testSource);
  console.log("\n=== Transformation ===");

  const result = babel.transformSync(testSource, {
    presets: [["@babel/preset-react", { runtime: "automatic" }]],
    plugins: [[createAutoTestIdPlugin(), {}]],
    configFile: false,
    babelrc: false,
  });

  console.log("\n=== Result ===");
  console.log(result.code);
  console.log(`\nContains data-testid: ${result.code.includes("data-testid")}`);
} catch (error) {
  console.error("Error:", error.message);
  console.error(error.stack);
}
