# @pablohpsilva/swc-plugin-auto-testid

SWC plugin that automatically injects `data-testid` attributes into JSX elements at build time. Written in Rust for maximum performance.

## Features

✅ **High performance**: Written in Rust and compiled to WebAssembly  
✅ **Component hierarchy**: `ComponentName.elementName`  
✅ **Next.js compatible**: Works with Next.js SWC configuration  
✅ **TypeScript support**: Full TypeScript compatibility  

⚠️ **Limitation**: Loop indexing is not yet supported (complex to implement in SWC). For loop indexing, use the [webpack loader](../webpack-loader) instead.

## Installation

```bash
npm install --save-dev @pablohpsilva/swc-plugin-auto-testid
# or
yarn add -D @pablohpsilva/swc-plugin-auto-testid
# or
pnpm add -D @pablohpsilva/swc-plugin-auto-testid
```

## Usage

### Next.js Configuration

```javascript
// next.config.js
const path = require("path");

module.exports = {
  experimental: {
    swcPlugins: [
      [
        "@pablohpsilva/swc-plugin-auto-testid",
        {
          separator: ".",
          includeElement: true,
          useHierarchy: true,
          skipElements: ["br", "hr", "img", "svg"],
          onlyInteractive: false,
        },
      ],
    ],
  },
};
```

### SWC Configuration

```json
{
  "jsc": {
    "experimental": {
      "plugins": [
        [
          "@pablohpsilva/swc-plugin-auto-testid",
          {
            "separator": ".",
            "includeElement": true,
            "useHierarchy": true,
            "skipElements": ["br", "hr", "img", "svg"],
            "onlyInteractive": false
          }
        ]
      ]
    }
  }
}
```

### Example Transformation

**Input:**
```jsx
export function Navigation({ activeTab, onTabChange }) {
  return (
    <nav>
      <ul>
        <li>
          <button onClick={() => onTabChange("users")}>
            Users
          </button>
        </li>
        <li>
          <button onClick={() => onTabChange("products")}>
            Products
          </button>
        </li>
      </ul>
    </nav>
  );
}
```

**Output:**
```jsx
export function Navigation({ activeTab, onTabChange }) {
  return (
    <nav data-testid="Navigation.nav">
      <ul data-testid="Navigation.ul">
        <li data-testid="Navigation.li">
          <button 
            onClick={() => onTabChange("users")}
            data-testid="Navigation.button"
          >
            Users
          </button>
        </li>
        <li data-testid="Navigation.li">
          <button 
            onClick={() => onTabChange("products")}
            data-testid="Navigation.button"
          >
            Products
          </button>
        </li>
      </ul>
    </nav>
  );
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `separator` | `string` | `"."` | Separator for test ID parts |
| `includeElement` | `boolean` | `true` | Include element names in test IDs |
| `useHierarchy` | `boolean` | `true` | Use component hierarchy in test IDs |
| `skipElements` | `string[]` | `["br", "hr", "img", "svg"]` | Elements to skip |
| `onlyInteractive` | `boolean` | `false` | Only add test IDs to interactive elements |

## Limitations

- **No loop indexing**: Unlike the Babel and Webpack versions, this plugin does not support dynamic loop indexing (`item.0`, `item.1`, etc.)
- **Rust/WASM dependency**: Requires a Rust toolchain to build from source

For applications requiring loop indexing, consider using [@pablohpsilva/webpack-auto-testid-loader](../webpack-loader) instead.

## Building from Source

```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build the plugin
npm run build
```

## License

MIT © Pablo Henrique Silva