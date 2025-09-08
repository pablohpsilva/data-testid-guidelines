const { TestIdTransformer } = require("./dist/transformer");

// Simple button test
const simpleButtonCode = `
export function Test() {
  return (
    <div>
      <button onClick={() => alert('test')} className="btn">
        Simple Button
      </button>
      <button>
        Multi Line Button
      </button>
    </div>
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
console.log(simpleButtonCode);

console.log("\n=== Transformed Code ===");
const result = transformer.transform(simpleButtonCode, "Test.jsx");
console.log(result);

console.log("\n=== Button Detection ===");
// Look for button elements in the result
const buttonElements = result.match(/<button[^>]*>/g) || [];
console.log("Button elements found:");
buttonElements.forEach((button, i) => {
  console.log(`  ${i + 1}. ${button}`);
  console.log(
    `     Has data-testid: ${
      button.includes("data-testid") ? "✅ YES" : "❌ NO"
    }`
  );
});
