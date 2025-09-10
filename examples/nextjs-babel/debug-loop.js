// Debug the specific loop issue from page.tsx

const babel = require("@babel/core");
const plugin =
  require("./node_modules/data-testid-guidelines-babel-plugin/dist/index.js").default;

console.log("🐛 Debugging Loop Issue\n");

// Test the exact code from page.tsx
console.log("📋 Testing Real Case - No Index Parameter");
const realCase = `
const UsersList = () => {
  return (
    <ul>
      {sampleUsers.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
`;

const realResult = babel.transformSync(realCase, {
  plugins: [[plugin, { autoGenerate: true }]],
  parserOpts: { plugins: ["jsx"] },
});

console.log("Input:", realCase.trim());
console.log("Output:", realResult.code);
console.log(
  "❌ Problem: UserListItem should get UsersList.UserListItem.${index}\n"
);

// Test with explicit index parameter
console.log("📋 Testing With Index Parameter");
const withIndex = `
const UsersList = () => {
  return (
    <ul>
      {sampleUsers.map((user, index) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};
`;

const indexResult = babel.transformSync(withIndex, {
  plugins: [[plugin, { autoGenerate: true }]],
  parserOpts: { plugins: ["jsx"] },
});

console.log("Input:", withIndex.trim());
console.log("Output:", indexResult.code);
console.log("✅ This should work with index parameter");
