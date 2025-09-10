// Example usage of the data-testid-guidelines-babel-plugin

const babel = require("@babel/core");
const plugin = require("./dist/index.js").default;

// Example 1: Simple component with root DOM element
const code1 = `
function UserCard() {
  return <div>User info</div>;
}
`;

console.log("=== Example 1: Simple component ===");
const result1 = babel.transformSync(code1, {
  plugins: [[plugin, {}]],
  parserOpts: { plugins: ["jsx"] },
});
console.log("Generated code:", result1.code);

// Example 2: Component with child components
const code2 = `
function UserProfile() {
  return (
    <div>
      <Avatar />
      <UserInfo />
    </div>
  );
}
`;

console.log("\n=== Example 2: Component hierarchy ===");
const result2 = babel.transformSync(code2, {
  plugins: [[plugin, {}]],
  parserOpts: { plugins: ["jsx"] },
});
console.log("Generated code:", result2.code);

// Example 3: Fragment support
const code3 = `
const Header = () => (
  <>
    <Logo />
    <Navigation />
  </>
);
`;

console.log("\n=== Example 3: Fragment support ===");
const result3 = babel.transformSync(code3, {
  plugins: [[plugin, {}]],
  parserOpts: { plugins: ["jsx"] },
});
console.log("Generated code:", result3.code);

// Example 4: Loop handling
const code4 = `
const UserList = ({ users }) => (
  <div>
    {users.map((user, index) => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
);
`;

console.log("\n=== Example 4: Loop handling ===");
const result4 = babel.transformSync(code4, {
  plugins: [[plugin, {}]],
  parserOpts: { plugins: ["jsx"] },
});
console.log("Generated code:", result4.code);

// Example 5: Custom attribute name
const code5 = `
function CypressComponent() {
  return <div><CustomButton /></div>;
}
`;

console.log("\n=== Example 5: Custom attribute name (data-cy) ===");
const result5 = babel.transformSync(code5, {
  plugins: [
    [
      plugin,
      {
        attributeName: "data-cy",
      },
    ],
  ],
  parserOpts: { plugins: ["jsx"] },
});
console.log("Generated code:", result5.code);

// Example 6: Respecting existing attributes
const code6 = `
function MyComponent() {
  return <CustomComponent data-testid="existing-id" />;
}
`;

console.log("\n=== Example 6: Respecting existing attributes ===");
const result6 = babel.transformSync(code6, {
  plugins: [[plugin, { respectExisting: true }]],
  parserOpts: { plugins: ["jsx"] },
});
console.log("Generated code:", result6.code);
