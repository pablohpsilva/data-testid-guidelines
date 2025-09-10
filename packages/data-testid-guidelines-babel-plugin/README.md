# data-testid-guidelines-babel-plugin

A Babel plugin that automatically generates hierarchical `data-testid` attributes for React components following predictable patterns.

## Features

- 🎯 **Automatic test ID generation** for React components and root DOM elements
- 🏗️ **Hierarchical structure** with dot notation (e.g., `Parent.Child.Component`)
- 🔄 **Loop-aware indexing** for components in `.map()` iterations
- 📝 **Fragment support** for components rendered in React.Fragment
- ⚙️ **Customizable attribute names** (e.g., `data-cy` for Cypress)
- 🎛️ **Respects existing attributes** (won't override manually set test IDs)
- 📝 **TypeScript support**

## Installation

```bash
# Using pnpm
pnpm add -D data-testid-guidelines-babel-plugin

# Using npm
npm install --save-dev data-testid-guidelines-babel-plugin

# Using yarn
yarn add -D data-testid-guidelines-babel-plugin
```

## Usage

### Basic Configuration

Add the plugin to your Babel configuration:

```json
{
  "plugins": ["data-testid-guidelines-babel-plugin"]
}
```

### Next.js Configuration

```javascript
// next.config.js
module.exports = {
  experimental: {
    swcPlugins: [
      // If using SWC, you'll need to configure differently
    ],
  },
  // For Babel mode
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: {
        loader: "babel-loader",
        options: {
          plugins: ["data-testid-guidelines-babel-plugin"],
        },
      },
    });
    return config;
  },
};
```

### Advanced Configuration

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "data-testid-guidelines-babel-plugin",
      {
        // Custom attribute name (default: 'data-testid')
        attributeName: "data-cy",

        // Auto-generate test IDs for components (default: true)
        autoGenerate: true,

        // Skip components that already have testId (default: true)
        respectExisting: true,
      },
    ],
  ],
};
```

## Options

| Option            | Type      | Default         | Description                                         |
| ----------------- | --------- | --------------- | --------------------------------------------------- |
| `attributeName`   | `string`  | `'data-testid'` | Custom attribute name instead of data-testid        |
| `autoGenerate`    | `boolean` | `true`          | Whether to auto-generate test IDs for components    |
| `respectExisting` | `boolean` | `true`          | Whether to skip components that already have testId |

## Examples

### Simple Component

```jsx
// Input
const UserCard = () => <div>User info</div>;

// Output
const UserCard = () => <div data-testid="UserCard">User info</div>;
```

### Component with Child Components

```jsx
// Input
function UserProfile() {
  return (
    <div>
      <Avatar />
      <UserInfo />
    </div>
  );
}

// Output
function UserProfile() {
  return (
    <div data-testid="UserProfile">
      <Avatar data-testid="UserProfile.Avatar" />
      <UserInfo data-testid="UserProfile.UserInfo" />
    </div>
  );
}
```

### React.Fragment Support

```jsx
// Input
const Header = () => (
  <>
    <Logo />
    <Navigation />
  </>
);

// Output
const Header = () => (
  <>
    <Logo data-testid="Header.Logo" />
    <Navigation data-testid="Header.Navigation" />
  </>
);
```

### Loop Handling

```jsx
// Input
const UserList = ({ users }) => (
  <div>
    {users.map((user, index) => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
);

// Output
const UserList = ({ users }) => (
  <div data-testid="UserList">
    {users.map((user, index) => (
      <UserCard
        key={user.id}
        user={user}
        data-testid={`UserList.UserCard.${index}`}
      />
    ))}
  </div>
);
```

### Respecting Existing Attributes

```jsx
// Input
function MyComponent() {
  return <CustomComponent data-testid="custom-id" />;
}

// Output (with respectExisting: true)
function MyComponent() {
  return <CustomComponent data-testid="custom-id" />;
}
```

## How It Works

This plugin automatically generates `data-testid` attributes following these rules:

1. **React Components**: Components (uppercase JSX elements) get hierarchical test IDs based on their parent component names
2. **Root DOM Elements**: DOM elements (lowercase JSX elements) that are the root of a component get the component's name
3. **Loop Support**: Components inside `.map()` iterations get indexed test IDs using template literals
4. **Fragment Support**: Components inside React.Fragment inherit the parent component's context

### Generated Test ID Patterns

- **Simple component**: `ComponentName`
- **Nested component**: `Parent.Child`
- **Component in loop**: `Parent.Component.${index}`
- **Root DOM element**: `ComponentName`

## Limitations

- **Intermediate Component Boundaries**: Components nested inside other components don't include intermediate component names in their hierarchy (e.g., `<Navigation />` inside `<Sidebar />` gets `Parent.Navigation` instead of `Parent.Sidebar.Navigation`)
- **Function Scope Only**: Only tracks React components at the function declaration/expression level
- **Simple Loop Detection**: Only detects standard `.map()`, `.forEach()`, `.filter()`, and `.reduce()` patterns

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Build the plugin
pnpm build

# Development mode (watch for changes)
pnpm dev
```

## License

MIT
