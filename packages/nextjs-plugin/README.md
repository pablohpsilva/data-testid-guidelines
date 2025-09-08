# @pablohpsilva/nextjs-auto-testid

A Next.js plugin that automatically injects `data-testid` attributes into JSX elements during build time, making E2E testing easier and more maintainable.

## ✨ Features

- **🎯 Automatic Test ID Generation**: Automatically adds `data-testid` attributes to JSX elements
- **🔄 Hierarchical IDs**: Creates meaningful, hierarchical test IDs like `Navigation.nav`, `Navigation.ul.li.button`
- **⚙️ Configurable**: Extensive configuration options for customization
- **🚀 Zero Runtime Impact**: Transforms code at build time, no runtime overhead
- **📦 Next.js Optimized**: Designed specifically for Next.js projects
- **🛠️ TypeScript Support**: Full TypeScript support with type definitions

## 🚀 Quick Start

### Installation

```bash
npm install --save-dev @pablohpsilva/nextjs-auto-testid
# or
yarn add --dev @pablohpsilva/nextjs-auto-testid
# or
pnpm add -D @pablohpsilva/nextjs-auto-testid
```

### Configuration

Add the plugin to your `next.config.js` or `next.config.ts`:

#### JavaScript Configuration

```javascript
// next.config.js
const { withAutoTestId } = require("@pablohpsilva/nextjs-auto-testid");

const nextConfig = {
  // Your existing Next.js configuration
};

module.exports = withAutoTestId(nextConfig, {
  enabled: true, // Enable in development
  separator: ".",
  includeElement: true,
  useHierarchy: true,
  skipElements: ["br", "hr", "img", "svg"],
  onlyInteractive: false,
});
```

#### TypeScript Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";
import { withAutoTestId } from "@pablohpsilva/nextjs-auto-testid";

const nextConfig: NextConfig = {
  // Your existing Next.js configuration
};

export default withAutoTestId(nextConfig, {
  enabled: true,
  separator: ".",
  includeElement: true,
  useHierarchy: true,
  skipElements: ["br", "hr", "img", "svg"],
  onlyInteractive: false,
});
```

## 📖 How It Works

The plugin transforms your JSX elements during build time by adding `data-testid` attributes:

### Input

```jsx
export function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <button>Home</button>
        </li>
        <li>
          <button>About</button>
        </li>
      </ul>
    </nav>
  );
}
```

### Output

```jsx
export function Navigation() {
  return (
    <nav data-testid="Navigation.nav">
      <ul data-testid="Navigation.ul">
        <li data-testid="Navigation.li">
          <button data-testid="Navigation.button">Home</button>
        </li>
        <li data-testid="Navigation.li">
          <button data-testid="Navigation.button">About</button>
        </li>
      </ul>
    </nav>
  );
}
```

## ⚙️ Configuration Options

| Option            | Type       | Default                      | Description                               |
| ----------------- | ---------- | ---------------------------- | ----------------------------------------- |
| `enabled`         | `boolean`  | `true`                       | Enable/disable the plugin                 |
| `separator`       | `string`   | `"."`                        | Separator for hierarchical test IDs       |
| `includeElement`  | `boolean`  | `true`                       | Include HTML element names in test IDs    |
| `useHierarchy`    | `boolean`  | `true`                       | Use component hierarchy in test IDs       |
| `skipElements`    | `string[]` | `["br", "hr", "img", "svg"]` | Elements to skip                          |
| `onlyInteractive` | `boolean`  | `false`                      | Only add test IDs to interactive elements |

### Configuration Examples

#### Only Interactive Elements

```javascript
withAutoTestId(nextConfig, {
  onlyInteractive: true, // Only buttons, inputs, links, etc.
});
```

#### Custom Separator

```javascript
withAutoTestId(nextConfig, {
  separator: "-", // Results in "Navigation-nav-button"
});
```

#### Skip Additional Elements

```javascript
withAutoTestId(nextConfig, {
  skipElements: ["br", "hr", "img", "svg", "span"], // Skip span elements too
});
```

#### Production Mode

```javascript
withAutoTestId(nextConfig, {
  enabled: process.env.NODE_ENV !== "production", // Only in development/testing
});
```

## 🎯 Test ID Patterns

The plugin generates predictable test ID patterns:

### Basic Pattern

- **Component Name**: Detected from function/const declarations
- **Element Name**: HTML element type (if `includeElement: true`)
- **Hierarchy**: Parent-child relationships (if `useHierarchy: true`)

### Examples

```jsx
// Component: UserCard
function UserCard() {
  return (
    <div>
      {" "}
      {/* data-testid="UserCard.div" */}
      <h2>Name</h2> {/* data-testid="UserCard.h2" */}
      <p>Email</p> {/* data-testid="UserCard.p" */}
    </div>
  );
}
```

### Interactive Elements Only

```jsx
// With onlyInteractive: true
function Form() {
  return (
    <form>
      {" "}
      {/* data-testid="Form.form" */}
      <label>Name</label> {/* No test ID */}
      <input /> {/* data-testid="Form.input" */}
      <button>Submit</button> {/* data-testid="Form.button" */}
    </form>
  );
}
```

## 🧪 Testing Integration

Use the generated test IDs in your E2E tests:

### Playwright

```javascript
// tests/navigation.spec.js
test("navigation works", async ({ page }) => {
  await page.goto("/");

  // Click on navigation items
  await page.click('[data-testid="Navigation.nav"]');
  await page.click('[data-testid="Navigation.ul.li.button"]');
});
```

### Cypress

```javascript
// cypress/e2e/navigation.cy.js
describe("Navigation", () => {
  it("should navigate correctly", () => {
    cy.visit("/");

    cy.get('[data-testid="Navigation.nav"]').should("be.visible");
    cy.get('[data-testid="Navigation.button"]').click();
  });
});
```

### Testing Library

```javascript
// __tests__/Navigation.test.js
import { render, screen } from "@testing-library/react";
import Navigation from "../components/Navigation";

test("renders navigation", () => {
  render(<Navigation />);

  expect(screen.getByTestId("Navigation.nav")).toBeInTheDocument();
  expect(screen.getByTestId("Navigation.button")).toBeInTheDocument();
});
```

## 🔧 Advanced Usage

### Environment-Based Configuration

```javascript
// next.config.js
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

module.exports = withAutoTestId(nextConfig, {
  enabled: isDev || isTest, // Only in dev and test environments
  onlyInteractive: !isDev, // All elements in dev, only interactive in test
});
```

### Custom Component Detection

The plugin automatically detects React components using these patterns:

- `export function ComponentName()`
- `export const ComponentName = ()`
- `function ComponentName()`
- `const ComponentName = ()`

## 🚨 Limitations

1. **Single-line JSX**: Currently optimized for single-line JSX elements
2. **Static Analysis**: Uses regex-based parsing for performance
3. **Build Time Only**: Only works during Next.js build process
4. **No React Components**: Skips React components (uppercase elements)

## 🛠️ Development

### Building the Plugin

```bash
git clone <repository>
cd nextjs-plugin
pnpm install
pnpm build
```

### Running Tests

```bash
pnpm test
```

### Demo

```bash
node demo.js
```

## 📊 Comparison with Other Solutions

| Feature             | This Plugin   | Manual Test IDs | Other Tools  |
| ------------------- | ------------- | --------------- | ------------ |
| **Setup Time**      | ⚡ Minutes    | 🐌 Hours/Days   | ⚡ Minutes   |
| **Maintenance**     | ✅ Zero       | ❌ High         | ⚠️ Medium    |
| **Consistency**     | ✅ Automatic  | ❌ Manual       | ✅ Automatic |
| **Performance**     | ✅ Build-time | ✅ No impact    | ⚠️ Runtime   |
| **Next.js Support** | ✅ Native     | ✅ Manual       | ⚠️ Generic   |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © Pablo Henrique Silva

## 🔗 Related Projects

- [@pablohpsilva/data-testid-guidelines](../core) - Core React components and utilities
- [@pablohpsilva/babel-plugin-auto-testid](../babel-plugin) - Babel plugin version
- [@pablohpsilva/webpack-auto-testid-loader](../webpack-loader) - Webpack loader version

## 📝 Changelog

### v1.0.0

- ✨ Initial release
- 🎯 Automatic test ID generation
- ⚙️ Configurable options
- 📦 Next.js integration
- 🧪 Comprehensive test suite

---

**Happy Testing!** 🎉

For more examples and documentation, visit the [main repository](https://github.com/pablohpsilva/data-testid-guidelines).
