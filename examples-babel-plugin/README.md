# Babel Plugin Auto TestId - Examples

This is a complete React application demonstrating the automatic test ID generation using the Babel plugin.

## 🎯 What This Demo Shows

This application demonstrates how the Babel plugin automatically injects `data-testid` attributes into your React components **without requiring any manual code changes**.

### Key Features Demonstrated:

1. **Zero Manual Configuration**: No `withTestId` wrappers or manual `data-testid` attributes
2. **Automatic Hierarchy**: Test IDs build up based on component nesting
3. **Multiple Component Types**: User cards, product cards, forms, navigation, todo lists
4. **Interactive Elements**: Buttons, forms, checkboxes, dropdowns
5. **Dynamic Content**: State changes, conditional rendering
6. **Comprehensive Testing**: Jest tests using the auto-generated test IDs

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔍 How It Works

### Before (Your Original Code)

```tsx
function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}
```

### After (Babel Plugin Transformation)

```tsx
function UserCard({ user }) {
  return (
    <div className="user-card" data-testid="UserCard.div">
      <h3 data-testid="UserCard.h3">{user.name}</h3>
      <p data-testid="UserCard.p">{user.email}</p>
      <button onClick={handleEdit} data-testid="UserCard.button">
        Edit
      </button>
    </div>
  );
}
```

## 🧪 Testing

The application includes comprehensive Jest tests that demonstrate how to use the automatically generated test IDs:

```tsx
// Tests use the auto-generated test IDs
test("renders user information correctly", () => {
  render(<UserCard user={mockUser} />);

  expect(screen.getByTestId("UserCard.div")).toBeInTheDocument();
  expect(screen.getByTestId("UserCard.h3")).toHaveTextContent("John Doe");
  expect(screen.getByTestId("UserCard.p")).toHaveTextContent(
    "john@example.com"
  );
});
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test UserCard.test.tsx
```

## 📋 Examples Included

### 1. User Cards (`/src/components/UserCard.tsx`)

- Displays user information with avatar, name, email, role
- Edit and delete actions
- Demonstrates nested component structure
- **Generated Test IDs**: `UserCard.div`, `UserCard.h3`, `UserCard.p`, `UserCard.button`, etc.

### 2. Product Cards (`/src/components/ProductCard.tsx`)

- Product catalog with pricing, descriptions, stock status
- Quantity selection, add to cart, wishlist functionality
- Conditional rendering based on stock status
- **Generated Test IDs**: `ProductCard.article`, `ProductCard.h3`, `ProductCard.select`, etc.

### 3. Todo List (`/src/components/TodoList.tsx`)

- Interactive todo management
- Add, toggle, delete, filter todos
- Form inputs, checkboxes, dynamic lists
- **Generated Test IDs**: `TodoList.div`, `TodoList.form`, `TodoList.input`, `TodoList.ul`, etc.

### 4. Contact Form (`/src/components/ContactForm.tsx`)

- Complex form with validation
- Various input types: text, email, textarea, select, checkbox
- Form submission and error handling
- **Generated Test IDs**: `ContactForm.div`, `ContactForm.form`, `ContactForm.input`, etc.

### 5. Navigation (`/src/components/Navigation.tsx`)

- Tab-based navigation
- Dynamic active states
- Brand and action buttons
- **Generated Test IDs**: `Navigation.nav`, `Navigation.ul`, `Navigation.button`, etc.

## 🔧 Configuration

The Babel plugin is configured in `babel.config.cjs`:

```javascript
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    // Only add test IDs in development and test environments
    ...(process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "development"
      ? [
          [
            "../plugins/babel-plugin-auto-testid.cjs",
            {
              separator: ".",
              includeElement: true,
              useHierarchy: true,
              skipElements: ["br", "hr", "img", "svg"],
              onlyInteractive: false,
            },
          ],
        ]
      : []),
  ],
};
```

### Plugin Options

| Option            | Value                        | Description                                            |
| ----------------- | ---------------------------- | ------------------------------------------------------ |
| `separator`       | `'.'`                        | Character used to separate test ID parts               |
| `includeElement`  | `true`                       | Include HTML element type in test ID                   |
| `useHierarchy`    | `true`                       | Build hierarchical test IDs based on component nesting |
| `skipElements`    | `['br', 'hr', 'img', 'svg']` | HTML elements to skip                                  |
| `onlyInteractive` | `false`                      | Only add test IDs to interactive elements              |

## 🎨 Inspecting Generated Test IDs

### In Browser DevTools

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Open browser DevTools (F12)
4. Inspect any element
5. Look for `data-testid` attributes in the HTML

### Example Generated Structure

```html
<!-- User Card Component -->
<div data-testid="UserCard.div" class="user-card">
  <header data-testid="UserCard.header" class="user-header">
    <div data-testid="UserCard.div" class="avatar">
      <span data-testid="UserCard.span">👨‍💼</span>
    </div>
    <div data-testid="UserCard.div" class="user-info">
      <h3 data-testid="UserCard.h3">John Doe</h3>
      <p data-testid="UserCard.p">john@example.com</p>
      <span data-testid="UserCard.span" class="role-badge">Admin</span>
    </div>
  </header>
  <div data-testid="UserCard.div" class="user-actions">
    <button data-testid="UserCard.button" class="btn btn-primary">
      Edit User
    </button>
    <button data-testid="UserCard.button" class="btn btn-danger">Delete</button>
  </div>
</div>
```

## 🚀 Benefits Demonstrated

### 1. **Zero Runtime Overhead**

- Test IDs are added at build time
- No performance impact on your application
- Only active in development/test environments

### 2. **No Code Changes Required**

- Existing components work without modification
- No need to wrap with HOCs
- No manual test ID management

### 3. **Consistent Naming**

- Automatic hierarchical structure
- Predictable test ID patterns
- Component name + element type

### 4. **Easy Testing**

- Clear, predictable test IDs for all elements
- No need to maintain manual test ID lists
- Automatic coverage of interactive elements

### 5. **Environment Specific**

- Only active when needed (development/test)
- Production builds remain clean
- Configurable based on environment

## 📚 Next Steps

1. **Run the Application**: `npm run dev` and explore the examples
2. **Inspect Test IDs**: Use browser DevTools to see generated attributes
3. **Run Tests**: `npm test` to see how tests use auto-generated IDs
4. **Modify Components**: Change components and see test IDs update automatically
5. **Configure Plugin**: Adjust settings in `babel.config.js` to suit your needs

## 🔗 Related Documentation

- [Main Library Documentation](../README.md)
- [Babel Plugin Documentation](../plugins/README.md)
- [Manual HOC Examples](../examples/README.md)
