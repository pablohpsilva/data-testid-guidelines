# Data TestId Guidelines - Examples

This directory contains example implementations demonstrating how to use the simplified `@pablohpsilva/data-testid-guidelines` library.

## 🚀 Getting Started

### Prerequisites

Make sure you have the main library built first:

```bash
# From the root directory
npm run build
```

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📁 Structure

- `src/App.tsx` - Main example components demonstrating the simplified patterns
- `src/main.tsx` - React application entry point
- `src/index.css` - Basic styling for the examples
- `index.html` - HTML template

## 🎯 Examples Included

### 1. Basic Button Components

Shows both manual testId assignment and HOC usage:

```tsx
// Manual approach
<Button testId="my-button">Click me</Button>;

// HOC approach
const EnhancedButton = withTestId(ButtonComponent);
<EnhancedButton testId="enhanced">Click me</EnhancedButton>;
```

### 2. Card Component

Demonstrates nested element test IDs:

```tsx
// Results in test IDs like:
// - "product-card"
// - "product-card.title"
// - "product-card.description"
// - "product-card.actions"
```

### 3. List Component

Shows how to handle arrays with indexed items:

```tsx
// Results in test IDs like:
// - "feature-list.title"
// - "feature-list.list"
// - "feature-list.list.item.0"
// - "feature-list.list.item.1"
```

### 4. User Profile

Complex nested component structure:

```tsx
// Results in hierarchical test IDs like:
// - "user-profile.info.name"
// - "user-profile.info.email"
// - "user-profile.roles.list.item.0"
```

### 5. Contact Form

Form with field organization:

```tsx
// Results in organized test IDs like:
// - "contact-form.field.name.input"
// - "contact-form.field.email.input"
// - "contact-form.submit"
```

### 6. Nested Component Hierarchy

Shows how components compose test IDs when nested:

```tsx
// When a Card contains a List, test IDs build up:
// - "contact-card.actions.social-links.list.item.0"
```

## 🔧 Key Patterns Demonstrated

### **withTestId HOC**

The main pattern for wrapping components:

```tsx
const MyComponent = withTestId<Props>(({ testId, ...props }) => (
  <div {...testIdAttr(testId!)}>{/* component content */}</div>
));
```

### **testIdAttr Helper**

Utility for creating data-testid attributes:

```tsx
<button {...testIdAttr("my-button")}>Click me</button>
// Results in: <button data-testid="my-button">Click me</button>
```

### **Hierarchical Test IDs**

Building nested test ID paths:

```tsx
// Parent component with testId="parent"
<div {...testIdAttr(testId!)}>
  <span {...testIdAttr(`${testId}.child`)}>Child element</span>
</div>
// Results in: data-testid="parent.child"
```

### **Loop Items**

Handling arrays with indexed test IDs:

```tsx
{
  items.map((item, index) => (
    <li {...testIdAttr(`${testId}.list.item.${index}`)}>{item}</li>
  ));
}
```

## 🧪 Testing

The examples generate predictable test IDs that you can inspect using browser dev tools:

1. Open browser dev tools (F12)
2. Inspect any element
3. Look for `data-testid` attributes
4. Notice the hierarchical structure: `parent.child.element.index`

## 📚 API Reference

### Core Exports

```tsx
// Main HOC
withTestId<T>(Component): FC<PropsWithTestId<T>>

// Utility function
testIdAttr(testId: string): { "data-testid": string }

// Types
PropsWithTestId<T>
WithTestId
```

### Usage Examples

```tsx
// Basic usage
const Button = withTestId<ButtonProps>(({ testId, children }) => (
  <button {...testIdAttr(testId!)}>{children}</button>
));

// With nested elements
const Card = withTestId<CardProps>(({ testId, title, content }) => (
  <div {...testIdAttr(testId!)}>
    <h2 {...testIdAttr(`${testId}.title`)}>{title}</h2>
    <p {...testIdAttr(`${testId}.content`)}>{content}</p>
  </div>
));

// Usage
<Card testId="product-card" title="Product" content="Description" />;
// Generates:
// - data-testid="product-card"
// - data-testid="product-card.title"
// - data-testid="product-card.content"
```

## 🏃‍♂️ Running Examples

1. **Development**: `npm run dev` - Starts Vite development server
2. **Build**: `npm run build` - Builds the examples for production
3. **Preview**: `npm run preview` - Preview the built examples
4. **Type Check**: `npm run typecheck` - Run TypeScript type checking

The examples will be available at `http://localhost:5173` when running in development mode.

## 💡 Best Practices Shown

1. **Consistent Naming**: Use descriptive, hierarchical names
2. **Component Wrapping**: Use `withTestId` HOC for reusable components
3. **Manual Assignment**: Use `testIdAttr` for one-off elements
4. **Nested Structure**: Build logical test ID hierarchies
5. **Index Handling**: Use consistent patterns for array items
6. **Form Organization**: Group form fields logically
