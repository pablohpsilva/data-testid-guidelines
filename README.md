# Data TestID Guidelines

A comprehensive suite of tools for automatically managing `data-testid` attributes in React applications. This monorepo contains multiple packages for different build systems and use cases.

## 📦 Packages

| Package | Description | Use Case |
|---------|-------------|----------|
| **[@pablohpsilva/data-testid-guidelines](./packages/core)** | Core React components and utilities | Runtime test ID management |
| **[@pablohpsilva/babel-plugin-auto-testid](./packages/babel-plugin)** | Babel plugin for automatic test ID injection | Vite, Create React App, Babel builds |
| **[@pablohpsilva/webpack-auto-testid-loader](./packages/webpack-loader)** | Webpack loader for automatic test ID injection | Next.js, Webpack builds |
| **[@pablohpsilva/swc-plugin-auto-testid](./packages/swc-plugin)** | SWC plugin for automatic test ID injection | Next.js with SWC, high-performance builds |

## 🚀 Quick Start

### For Next.js Projects (Recommended)

```bash
npm install --save-dev @pablohpsilva/webpack-auto-testid-loader
```

```javascript
// next.config.js
module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.module.rules.push({
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [{
          loader: "@pablohpsilva/webpack-auto-testid-loader",
          options: { enabled: true }
        }],
        enforce: "pre"
      });
    }
    return config;
  }
};
```

### For Vite Projects

```bash
npm install --save-dev @pablohpsilva/babel-plugin-auto-testid
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['@pablohpsilva/babel-plugin-auto-testid']]
      }
    })
  ]
});
```

### For Runtime Use

```bash
npm install @pablohpsilva/data-testid-guidelines
```

```jsx
import { withTestId } from '@pablohpsilva/data-testid-guidelines';

const Button = withTestId(({ children, testId }) => (
  <button data-testid={testId}>{children}</button>
));
```

## ✨ Features

### 🎯 **Perfect Test ID Generation**

All packages generate clean, hierarchical test IDs:

```jsx
// Input
export function Navigation() {
  const tabs = ["Users", "Products"];
  return (
    <nav>
      <ul>
        {tabs.map((tab, index) => (
          <li key={tab}>
            <button>{tab}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Output
<nav data-testid="Navigation.nav">
  <ul data-testid="Navigation.ul">
    <li data-testid="Navigation.tabs.item.0">
      <button data-testid="Navigation.tabs.item.0.button">Users</button>
    </li>
    <li data-testid="Navigation.tabs.item.1">
      <button data-testid="Navigation.tabs.item.1.button">Products</button>
    </li>
  </ul>
</nav>
```

### 🔄 **Loop Indexing Support**

| Package | Loop Indexing | Performance | Build Time |
|---------|---------------|-------------|------------|
| **Babel Plugin** | ✅ Perfect | Fast | Fast |
| **Webpack Loader** | ✅ Perfect | Fast | Medium |
| **SWC Plugin** | ❌ Limited | Fastest | Fastest |
| **Core Library** | ✅ Runtime | Fast | N/A |

### 🎨 **Semantic HTML Support**

Automatically includes semantic element names:
- `Navigation.header`
- `Navigation.main` 
- `Navigation.footer`
- `Navigation.nav`
- `Navigation.aside`

### ⚙️ **Configurable Options**

All packages support consistent configuration:

```javascript
{
  separator: ".",           // Test ID separator
  includeElement: true,     // Include element names
  useHierarchy: true,       // Use component hierarchy
  skipElements: ["br", "hr", "img", "svg"], // Elements to skip
  onlyInteractive: false    // Only interactive elements
}
```

## 📊 **Package Comparison**

### When to Use Each Package

#### 🥇 **Webpack Loader** (Recommended for Next.js)
- ✅ Perfect loop indexing
- ✅ Works with Next.js out of the box
- ✅ No additional configuration needed
- ✅ Full TypeScript support

#### 🥈 **Babel Plugin** (Recommended for Vite)
- ✅ Perfect loop indexing
- ✅ Works with any Babel setup
- ✅ Vite compatible
- ✅ Fastest build times

#### 🥉 **SWC Plugin** (Performance-focused)
- ✅ Fastest compilation
- ✅ Rust-based performance
- ❌ Limited loop indexing
- ⚠️ Complex to build

#### 🛠️ **Core Library** (Runtime)
- ✅ No build-time setup
- ✅ Runtime flexibility
- ❌ Manual component wrapping
- ❌ Larger bundle size

## 🏗️ **Development**

### Setup

```bash
# Install dependencies
npm install

# Install all package dependencies
npm run install:all

# Build all packages
npm run build

# Test all packages
npm run test
```

### Publishing

```bash
# Build and publish all packages
npm run publish:all
```

## 📝 **Examples**

- **[Next.js Example](./examples-nextjs)** - Complete Next.js setup with webpack loader
- **[Vite Example](./examples-babel-plugin)** - Vite setup with Babel plugin
- **[Core Library Example](./examples)** - Runtime usage examples

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

MIT © Pablo Henrique Silva

## 🔗 **Links**

- [GitHub Repository](https://github.com/pablohpsilva/data-testid-guidelines)
- [Issues](https://github.com/pablohpsilva/data-testid-guidelines/issues)
- [NPM Organization](https://www.npmjs.com/org/pablohpsilva)