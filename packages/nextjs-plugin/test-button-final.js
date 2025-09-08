const { TestIdTransformer } = require("./dist/transformer");

// Test the exact Navigation structure with Wrapper component and complex button
const navigationCode = `
export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "users", label: "Users", icon: "👥" },
    { id: "products", label: "Products", icon: "🛍️" },
  ];

  return (
    <nav className="bg-white p-4 rounded-lg mb-8 shadow-sm">
      <div className="flex gap-4 items-center">
        <ul className="flex list-none gap-2 margin-0 padding-0">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className="btn"
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}`;

const transformer = new TestIdTransformer({
  enabled: true,
  separator: ".",
  includeElement: true,
  useHierarchy: true,
  skipElements: ["br", "hr", "img", "svg"],
  onlyInteractive: false,
});

console.log("=== Original Code ===");
console.log(navigationCode);

console.log("\n=== Transformed Code ===");
const result = transformer.transform(navigationCode, "Navigation.jsx");
console.log(result);

console.log("\n=== Final Analysis ===");
const testIds =
  result.match(/data-testid=\{[^}]+\}|data-testid="[^"]+"/g) || [];
console.log("All generated test IDs:");
testIds.forEach((testId, i) => console.log(`  ${i + 1}. ${testId}`));

console.log("\n=== Expected Hierarchy ===");
console.log("Expected test IDs:");
console.log("  Navigation.nav");
console.log("  Navigation.nav.div");
console.log("  Navigation.nav.ul");
console.log("  Navigation.ul.li.users (loop item)");
console.log("  Navigation.ul.li.button.users (button inside li)");
console.log("  Navigation.ul.li.button.span.users (spans inside button)");

const hasButtonTestId =
  result.includes("<button") && result.includes("data-testid");
const hasProperHierarchy = testIds.some(
  (id) => id.includes("Navigation.ul.li") || id.includes("Navigation.button")
);

console.log(`\nButton has test ID: ${hasButtonTestId ? "✅ YES" : "❌ NO"}`);
console.log(`Proper hierarchy: ${hasProperHierarchy ? "✅ YES" : "❌ NO"}`);

// Check for broken syntax
const hasBrokenSyntax = result.includes("onClick={() = data-testid=");
console.log(
  `JSX syntax preserved: ${hasBrokenSyntax ? "❌ BROKEN" : "✅ GOOD"}`
);
