# Auto TestId Next.js Examples

This directory demonstrates how to use automatic `data-testid` injection in Next.js applications using different approaches.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser and inspect elements to see generated test IDs
# Visit: http://localhost:3000
```

## 📋 Available Approaches

### 1. Babel Plugin Approach (Recommended)

This is the easiest approach as it reuses our existing Babel plugin.

**Configuration files:**

- `.babelrc` - Babel configuration with our plugin
- `next.config.js` - Basic Next.js configuration

**How it works:**

- Next.js automatically uses Babel when `.babelrc` is present
- Our Babel plugin transforms JSX at build time
- No runtime overhead

**Pros:**

- ✅ Easy to set up
- ✅ Reuses existing Babel plugin
- ✅ Works with all Next.js versions
- ✅ No runtime overhead

**Cons:**

- ❌ Uses Babel instead of SWC (slightly slower builds)

### 2. Webpack Plugin Approach (Alternative)

For teams that prefer to avoid Babel and stick with SWC.

**Configuration files:**

- `next.config.js` - Webpack configuration with our custom plugin
- `plugins/webpack-plugin-auto-testid.js` - Custom Webpack plugin
- `plugins/webpack-auto-testid-loader.js` - Custom Webpack loader

**How it works:**

- Webpack plugin intercepts JSX/TSX files during build
- Uses Babel transformation only for test ID injection
- SWC handles the main compilation

**Pros:**

- ✅ Keeps SWC for main compilation
- ✅ Only uses Babel for test ID transformation
- ✅ More granular control

**Cons:**

- ❌ More complex setup
- ❌ Custom Webpack configuration required

## 🔧 Configuration Options

Both approaches support the same configuration options:

```javascript
{
  // Basic options
  separator: ".",              // Separator for test ID parts
  includeElement: true,        // Include HTML element names
  useHierarchy: true,          // Build hierarchical test IDs

  // Element filtering
  skipElements: ["br", "hr", "img", "svg"],  // Elements to skip
  onlyInteractive: false,      // Only add to interactive elements

  // Environment control
  enabled: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
}
```

## 📁 Project Structure

```
examples-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with global styles
│   │   └── page.tsx         # Main page component
│   └── components/
│       ├── Navigation.tsx   # Tab navigation component
│       ├── UserCard.tsx     # User card with actions
│       └── ProductCard.tsx  # Product card with state
├── .babelrc                 # Babel configuration (Approach 1)
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies and scripts
```

## 🧪 Generated Test IDs

The plugin automatically generates hierarchical test IDs following the guidelines:

### Example Output:

```html
<!-- Main page structure -->
<div data-testid="HomePage.div">
  <header data-testid="HomePage.header">
    <h1 data-testid="HomePage.h1">Auto TestId Next.js Demo</h1>
  </header>

  <main data-testid="HomePage.main">
    <section data-testid="HomePage.section">
      <h2 data-testid="HomePage.h2">User Management</h2>

      <!-- Loop items with indices -->
      <div data-testid="HomePage.sampleUsers.item.0">
        <div data-testid="UserCard.div">
          <header data-testid="UserCard.header">
            <h3 data-testid="UserCard.h3">John Doe</h3>
          </header>
          <footer data-testid="UserCard.footer">
            <button data-testid="UserCard.button">Edit User</button>
          </footer>
        </div>
      </div>
    </section>
  </main>

  <footer data-testid="HomePage.footer">
    <p data-testid="HomePage.p">Built with Next.js + Auto TestId Plugin</p>
  </footer>
</div>
```

### Navigation Component:

```html
<nav data-testid="Navigation.nav">
  <ul data-testid="Navigation.ul">
    <li data-testid="Navigation.tabs.item.0">
      <button data-testid="Navigation.button">👥 Users</button>
    </li>
    <li data-testid="Navigation.tabs.item.1">
      <button data-testid="Navigation.button">🛍️ Products</button>
    </li>
  </ul>
</nav>
```

## 🧪 Testing

```bash
# Run tests with automatic test IDs
npm test

# Run tests in watch mode
npm run test:watch
```

Test files can use the generated test IDs:

```javascript
import { render, screen } from "@testing-library/react";
import HomePage from "../src/app/page";

test("should render user management section", () => {
  render(<HomePage />);

  // These test IDs are automatically generated!
  expect(screen.getByTestId("HomePage.h1")).toBeInTheDocument();
  expect(screen.getByTestId("Navigation.nav")).toBeInTheDocument();
  expect(screen.getByTestId("Navigation.tabs.item.0")).toBeInTheDocument();
});
```

## 🎛️ Switching Between Approaches

### To use Babel approach:

1. Keep `.babelrc` file
2. Use basic `next.config.js`

### To use Webpack approach:

1. Delete `.babelrc` file
2. Uncomment webpack section in `next.config.js`

## 🔍 Debugging

To see what test IDs are being generated:

1. **Browser DevTools**: Inspect elements to see `data-testid` attributes
2. **React DevTools**: View component props and attributes
3. **Build output**: Check build logs for transformation details

## 📚 Related Documentation

- [Main README](../README.md) - Library overview and guidelines
- [Babel Plugin Examples](../examples-babel-plugin/) - Vite + Babel setup
- [Core Library](../src/) - Library source code
- [Plugin Source](../plugins/) - Babel and Webpack plugins

## 🚨 Troubleshooting

**Test IDs not appearing?**

- Check that you're in development or test environment
- Verify plugin configuration in `.babelrc` or `next.config.js`
- Check browser DevTools for any build errors

**Build errors?**

- Ensure all dependencies are installed: `npm install`
- Check Next.js version compatibility
- Verify plugin file paths are correct

**SWC vs Babel?**

- Babel approach: Easier setup, slightly slower builds
- Webpack approach: Keeps SWC, more complex configuration
