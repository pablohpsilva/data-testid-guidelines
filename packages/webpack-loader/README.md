# @pablohpsilva/webpack-auto-testid-loader

Webpack loader that automatically injects `data-testid` attributes into JSX elements at build time. Perfect for Next.js applications.

## Features

✅ **Perfect loop indexing**: `Navigation.tabs.item.0`, `Navigation.tabs.item.1`  
✅ **Component hierarchy**: `ComponentName.elementName`  
✅ **Next.js compatible**: Works with Next.js webpack configuration  
✅ **TypeScript support**: Full TypeScript compatibility  
✅ **No Babel required**: Uses internal Babel transformation  

## Installation

```bash
npm install --save-dev @pablohpsilva/webpack-auto-testid-loader
# or
yarn add -D @pablohpsilva/webpack-auto-testid-loader
# or
pnpm add -D @pablohpsilva/webpack-auto-testid-loader
```

## Usage

### Next.js Configuration

```javascript
// next.config.js
const path = require("path");

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Only apply in development and test environments
    if (dev || process.env.NODE_ENV === "test") {
      config.module.rules.push({
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "@pablohpsilva/webpack-auto-testid-loader",
            options: {
              enabled: true,
              separator: ".",
              includeElement: true,
              useHierarchy: true,
              skipElements: ["br", "hr", "img", "svg"],
              onlyInteractive: false,
            },
          },
        ],
        enforce: "pre", // Run before other loaders
      });
    }

    return config;
  },
};
```

### Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "@pablohpsilva/webpack-auto-testid-loader",
            options: {
              enabled: process.env.NODE_ENV === "development",
              separator: ".",
              includeElement: true,
              useHierarchy: true,
            },
          },
        ],
        enforce: "pre",
      },
    ],
  },
};
```

### Example Transformation

**Input:**
```jsx
export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "users", label: "Users" },
    { id: "products", label: "Products" },
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
```

**Output:**
```jsx
export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "users", label: "Users" },
    { id: "products", label: "Products" },
  ];

  return (
    <nav data-testid="Navigation.nav">
      <ul data-testid="Navigation.ul">
        {tabs.map((tab, index) => (
          <li key={tab.id} data-testid={`Navigation.tabs.item.${index}`}>
            <button 
              onClick={() => onTabChange(tab.id)}
              data-testid={`Navigation.tabs.item.${index}.button`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `NODE_ENV === "development" \|\| NODE_ENV === "test"` | Enable/disable the loader |
| `separator` | `string` | `"."` | Separator for test ID parts |
| `includeElement` | `boolean` | `true` | Include element names in test IDs |
| `useHierarchy` | `boolean` | `true` | Use component hierarchy in test IDs |
| `skipElements` | `string[]` | `["br", "hr", "img", "svg"]` | Elements to skip |
| `onlyInteractive` | `boolean` | `false` | Only add test IDs to interactive elements |

## License

MIT © Pablo Henrique Silva
