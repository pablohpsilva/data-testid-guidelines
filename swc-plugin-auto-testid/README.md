# SWC Plugin Auto TestId

A SWC plugin that automatically injects `data-testid` attributes into React components following the `@pablohpsilva/data-testid-guidelines` patterns.

## 🎯 Features

- ✅ **Automatic Test ID Generation**: No manual `data-testid` attributes needed
- ✅ **Hierarchical Naming**: Generates `ComponentName.elementName` patterns
- ✅ **Loop Support**: Handles map iterations with proper indexing
- ✅ **Next.js Compatible**: Works with Next.js 12+ SWC compiler
- ✅ **Zero Runtime Cost**: Transformations happen at build time
- ✅ **TypeScript Support**: Full TypeScript compatibility

## 🚀 Installation

### Prerequisites

- Rust (latest stable version)
- Node.js 16+
- Next.js 12+ (or any project using SWC)

### Building the Plugin

```bash
# Clone or download this directory
cd swc-plugin-auto-testid

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-wasi

# Build the plugin
./build.sh
```

This will create `target/wasm32-wasi/release/swc_plugin_auto_testid.wasm`

## ⚙️ Configuration

### Next.js Setup

```javascript
// next.config.js
const path = require("path");

module.exports = {
  experimental: {
    swcPlugins: [
      [
        path.resolve("./path/to/swc_plugin_auto_testid.wasm"),
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

### SWC Configuration (.swcrc)

```json
{
  "jsc": {
    "experimental": {
      "plugins": [
        [
          "./path/to/swc_plugin_auto_testid.wasm",
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

## 🔧 Configuration Options

| Option            | Type     | Default                      | Description                               |
| ----------------- | -------- | ---------------------------- | ----------------------------------------- |
| `separator`       | string   | `"."`                        | Separator between test ID parts           |
| `includeElement`  | boolean  | `true`                       | Include HTML element names in test IDs    |
| `useHierarchy`    | boolean  | `true`                       | Build hierarchical component names        |
| `skipElements`    | string[] | `["br", "hr", "img", "svg"]` | Elements to skip                          |
| `onlyInteractive` | boolean  | `false`                      | Only add test IDs to interactive elements |

## 📋 Generated Test ID Patterns

### Basic Component

```jsx
// Input
function UserCard({ user }) {
  return (
    <div className="card">
      <h2>{user.name}</h2>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}

// Output
function UserCard({ user }) {
  return (
    <div className="card" data-testid="UserCard.div">
      <h2 data-testid="UserCard.h2">{user.name}</h2>
      <button onClick={handleEdit} data-testid="UserCard.button">
        Edit
      </button>
    </div>
  );
}
```

### Component with Loops

```jsx
// Input
function Navigation({ tabs }) {
  return (
    <nav>
      <ul>
        {tabs.map((tab, index) => (
          <li key={tab.id}>
            <button onClick={() => setTab(tab.id)}>{tab.label}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Output (generated)
function Navigation({ tabs }) {
  return (
    <nav data-testid="Navigation.nav">
      <ul data-testid="Navigation.ul">
        {tabs.map((tab, index) => (
          <li key={tab.id} data-testid="Navigation.tabs.item.${index}">
            <button
              onClick={() => setTab(tab.id)}
              data-testid="Navigation.button"
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

## 🧪 Testing

The generated test IDs can be used directly in your tests:

```javascript
import { render, screen } from "@testing-library/react";
import { UserCard } from "./UserCard";

test("should render user card", () => {
  render(<UserCard user={mockUser} />);

  // These test IDs are automatically generated!
  expect(screen.getByTestId("UserCard.div")).toBeInTheDocument();
  expect(screen.getByTestId("UserCard.h2")).toHaveTextContent("John Doe");
  expect(screen.getByTestId("UserCard.button")).toBeInTheDocument();
});
```

## 🔍 Debugging

To see what test IDs are being generated:

1. **Build your project** with the plugin enabled
2. **Inspect the browser** DevTools to see `data-testid` attributes
3. **Check build output** for any plugin warnings or errors

## 📦 Alternative: Using Existing Plugin

If building from source isn't preferred, you can use the existing `swc-plugin-component-annotate`:

```bash
npm install swc-plugin-component-annotate
```

```javascript
// next.config.js
module.exports = {
  experimental: {
    swcPlugins: [
      [
        "swc-plugin-component-annotate",
        {
          "component-attr": "data-testid",
        },
      ],
    ],
  },
};
```

## 🚧 Current Limitations

- **Loop Index Detection**: Basic loop support (advanced map context detection in progress)
- **Complex Component Patterns**: HOCs and render props need additional testing
- **Build Size**: WASM file adds ~100KB to build (minimal impact)

## 🤝 Contributing

1. Fork the repository
2. Make changes to `src/lib.rs`
3. Run `./build.sh` to test
4. Submit a pull request

## 📄 License

MIT License - see the main project README for details.

## 🔗 Related

- [Main Library](../src/) - Runtime HOC approach
- [Babel Plugin](../plugins/) - Babel-based alternative
- [Examples](../examples-nextjs/) - Usage examples
