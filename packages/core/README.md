# @pablohpsilva/data-testid-guidelines

Core library providing React components and utilities for consistent data-testid management.

## Installation

```bash
npm install @pablohpsilva/data-testid-guidelines
# or
yarn add @pablohpsilva/data-testid-guidelines
# or
pnpm add @pablohpsilva/data-testid-guidelines
```

## Usage

### withTestId HOC

```jsx
import React from 'react';
import { withTestId } from '@pablohpsilva/data-testid-guidelines';

const Button = ({ children, onClick, testId }) => (
  <button data-testid={testId} onClick={onClick}>
    {children}
  </button>
);

const ButtonWithTestId = withTestId(Button);

// Usage
<ButtonWithTestId testId="my-button">Click me</ButtonWithTestId>
// Renders: <button data-testid="ButtonWithTestId.my-button">Click me</button>
```

### testIdAttr Utility

```jsx
import React from 'react';
import { testIdAttr } from '@pablohpsilva/data-testid-guidelines';

const MyComponent = () => (
  <div {...testIdAttr('container')}>
    <h1 {...testIdAttr('title')}>Hello World</h1>
  </div>
);
```

## API

### `withTestId(Component)`

Higher-Order Component that automatically generates hierarchical test IDs.

**Parameters:**
- `Component`: React component to wrap

**Returns:** Enhanced component with automatic test ID management

### `testIdAttr(testId)`

Utility function to create data-testid attributes.

**Parameters:**
- `testId`: String identifier for the test ID

**Returns:** Object with `data-testid` property

### Types

```typescript
interface WithTestId {
  testId?: string;
}

type PropsWithTestId<T = Record<string, unknown>> = T & WithTestId;
```

## License

MIT © Pablo Henrique Silva
