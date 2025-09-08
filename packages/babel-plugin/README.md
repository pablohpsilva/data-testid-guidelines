# @pablohpsilva/babel-plugin-auto-testid

Babel plugin that automatically injects `data-testid` attributes into JSX elements at build time.

## Features

✅ **Perfect loop indexing**: `Navigation.tabs.item.0`, `Navigation.tabs.item.1`  
✅ **Component hierarchy**: `ComponentName.elementName`  
✅ **Semantic HTML elements**: `header`, `main`, `footer`, `nav`, etc.  
✅ **No duplicate names**: Clean, minimal test IDs  
✅ **TypeScript support**: Full TypeScript compatibility  

## Installation

```bash
npm install --save-dev @pablohpsilva/babel-plugin-auto-testid
# or
yarn add -D @pablohpsilva/babel-plugin-auto-testid
# or
pnpm add -D @pablohpsilva/babel-plugin-auto-testid
```

## Usage

### Babel Configuration

Add to your `.babelrc` or `babel.config.js`:

```json
{
  "plugins": [
    ["@pablohpsilva/babel-plugin-auto-testid", {
      "separator": ".",
      "includeElement": true,
      "useHierarchy": true,
      "skipElements": ["br", "hr", "img", "svg"],
      "onlyInteractive": false
    }]
  ]
}
```

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@pablohpsilva/babel-plugin-auto-testid', {
            // options here
          }]
        ]
      }
    })
  ]
});
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
| `separator` | `string` | `"."` | Separator for test ID parts |
| `includeElement` | `boolean` | `true` | Include element names in test IDs |
| `useHierarchy` | `boolean` | `true` | Use component hierarchy in test IDs |
| `skipElements` | `string[]` | `["br", "hr", "img", "svg"]` | Elements to skip |
| `onlyInteractive` | `boolean` | `false` | Only add test IDs to interactive elements |

## License

MIT © Pablo Henrique Silva
