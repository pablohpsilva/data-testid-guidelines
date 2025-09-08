# Guidelines for Defining data-testid's in React Applications

- [EN](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README.md)
- [ES](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-ES.md)
- [FR](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-FR.md)
- [JP](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-JP.md)
- [LU](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-LG.md)
- [PT-BR](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-PTBR.md)
- [RU](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-RU.md)

Creating predictable, unique, and reliable `data-testid` attributes is essential for ensuring robust and maintainable tests. This guide provides best practices, examples, and common patterns for defining `data-testid` attributes in your React (or basically any) applications.

## Why Use data-testid's?

- **Consistency**: Provides a consistent way to identify elements across different test suites.
- **Stability**: Less likely to change compared to class names or text content, making tests more reliable.
- **Clarity**: Improves the readability of tests by clearly indicating which elements are being targeted.

## Best Practices

- **Use Semantic Naming**: Use clear and descriptive names that reflect the purpose of the element. Avoid generic names.
- **Apply to Key Elements Only**: Apply `data-testid` to key interactive elements or those that require direct interaction in tests.
- **Avoid Using for Styling**: The `data-testid` should be used exclusively for testing purposes and not for styling or other logic.
- **Keep IDs Unique**: Ensure that `data-testid` values are unique within the scope of your application to avoid conflicts.

## Defining data-testid Guidelines

- **Use Pascal Case** (e.g. `MyComponent`) for components and camel case (e.g. `section`) for elements.
  - **Good**:
    - Clearly indicates the origin and purpose of the element.
    - Adds specificity, making it unique and predictable.
    - Reduces the likelihood of duplication.
    - Provides a clear hierarchy for debugging.
      - E.g.: `MyComponent.NameList.NameListItem.0.label` shows the origin and hierarchy of the element.
    - Ignoring this guideline might lead to loss of the above benefits, depending on your team's maturity in creating and maintaining these `data-testid`s.
  - **Bad**:
    - Names can become long the deeper you go in the DOM tree.
    - Requires more typing when writing tests.
- **Create a Simple Type/Interface** that can be expanded by relying on a property called `testId` for your components.
  - **Good**:
    - Avoids repetition by having a reusable interface.
    - Automatically protects against future changes.
    - Clearly identifies components that support or need a `data-testid`.
  - **Bad**:
    - In ongoing projects, you’ll need to create and apply this type in many files.
- **Use Specific Component Property `testId`**:
  - **Good**:
    - Ensures uniqueness by combining parent and child component names.
    - Simplifies identifying and interacting with elements.
  - **Bad**:
    - Can result in long `data-testid` values, which may be cumbersome.
- **Use `.` (Dot) as a Separator**:
  - **Good**:
    - Provides a clear chain of information.
    - Visually more appealing than other separators.
  - **Bad**:
    - Some may not prefer it, though no significant downsides are noted.

## Adding data-testid to Your Components

We suggest assigning unique test IDs to the elements you intend to interact with in your tests. Relying on these IDs is more reliable than using other attributes, like raw text, which can change frequently and vary by locale. Additionally, using unique test IDs throughout your application simplifies the process of identifying and interacting with specific elements, enhancing code readability and making it easier to navigate and maintain your codebase.

The following examples should cover most (if not all) possible scenarios and should follow all the best practices.

```typescript
import { FC, Fragment, PropsWithChildren } from "react";

type PropWithTestId = { testId: string };

const MainComponent: FC<
  {
    description: string;
    title: string;
    nameList: string[];
  } & Partial<PropWithTestId>
> = ({ testId, description, nameList, title }) => {
  const componentName = testId ?? MainComponent?.name;
  return (
    <>
      <Heading testId={componentName}>{title}</Heading>
      <p data-testid={`${componentName}.description`}>{description}</p>

      <p data-testid={`${componentName}.exampleSimpleLoop`}>
        Example of a loop, no extra components
      </p>
      {nameList.map((name, index) => (
        <Fragment key={name}>
          <span data-testid={`${componentName}.nameList.item.${index}`}>
            {name}
          </span>
          <br />
          <br />
        </Fragment>
      ))}

      <p data-testid={`${componentName}.exampleComponentLoop`}>
        Example of a loop, WITH extra components
      </p>
      <NameList items={nameList} testId={componentName} />
    </>
  );
};

// This component DOES NOT support being standalone
const Heading: FC<PropsWithChildren<PropWithTestId>> = ({
  children,
  testId,
}) => {
  return <h1 data-testid={`${testId}.Heading`}>{children}</h1>;
};

// This component supports being standalone
const NameList: FC<{ items: string[] } & Partial<PropWithTestId>> = ({
  items,
  testId,
}) => {
  const componentName = `${testId ? `${testId}.` : ""}${NameList?.name}`;
  return items.map((name, index) => (
    <Fragment key={name}>
      <NameListItem {...{ index, testId: componentName }}>{name}</NameListItem>
      <br />
      <br />
    </Fragment>
  ));
};

// This component DOES NOT support being standalone
const NameListItem: FC<
  PropsWithChildren<{ index: number } & PropWithTestId>
> = ({ children, index, testId }) => {
  const componentName = `${testId}.${NameListItem?.name}`;
  return <span data-testid={`${componentName}.${index}`}>{children}</span>;
};
```

In the example above, you can clearly see all the possible data-testids and how they behave. Here's a list of unique data-testids, considering the below-mentioned MainComponent component usage:

```
<MainComponent
  title="Component title"
  description="nice description"
  nameList={["ana", "bob", "kostantine"]}
/>
```

Here's the list of generated data-testid's:

<img src="images/rendered.png" alt="rendered components with data-testids being displayed">

```
MainComponent.heading
MainComponent.description

// regular loop
MainComponent.nameList.item.0
MainComponent.nameList.item.1
MainComponent.nameList.item.2

// component-based loop
MainComponent.NameList.NameListItem.0
MainComponent.NameList.NameListItem.1
MainComponent.NameList.NameListItem.2
```

## Adding data-testid's on multiple blocks

```
type PropWithTestId = { testId: string }

const MainComponent:FC<{
    description:string;
    title:string;
    nameList: string[]
  } & Partial<PropWithTestId>> = ({ testId, description, nameList, title }) => {
  const componentName = testId ?? MainComponent?.name
  const componentNameSection = `${componentName}.section`;
  const componentNameBlock = `${componentName}.block`;
  return (
    <>
      <section>
        <Heading testId={componentNameSection}>{title}</Heading>

        <p testId={`${componentNameSection}.description`}>{description}</p>
      </section>

      <div>
         {
          names.map((name, index) => (
            <span
              key={name}
              testId={`${componentNameBlock}.nameList.item.${index}`}>
              {name}
            </span>
          ))
        }
      </div>
    </>
  )
}
```

Here's the list of generated data-testid's:

```
MainComponent.section.heading
MainComponent.section.description
MainComponent.block.nameList.item.0
MainComponent.block.nameList.item.1
MainComponent.block.nameList.item.2
```

## 🚀 Library Usage with withTestId HOC

For a modern, simplified approach, you can use the `withTestId` Higher-Order Component (HOC) that automatically handles test ID generation:

### Installation

```bash
npm install @pablohpsilva/data-testid-guidelines
```

### Basic Usage

```typescript
import {
  withTestId,
  PropsWithTestId,
  testIdAttr,
} from "@pablohpsilva/data-testid-guidelines";
import { FC, HTMLAttributes } from "react";

// Example 1: Simple Button Component
const Button = withTestId(function Button({
  testId,
  ...props
}: PropsWithTestId<HTMLAttributes<HTMLButtonElement>>) {
  return (
    <button data-testid={testId} {...props}>
      Button
    </button>
  );
});

// Usage:
<Button testId="my-button" onClick={() => alert("Clicked!")}>
  Click me
</Button>;
// Results in: data-testid="my-button.Button"
```

### Example 2: Enhanced Button with Different Approach

```typescript
const EnhancedButton = withTestId(function EnhancedButton({
  testId,
  children,
  ...props
}: PropsWithTestId<HTMLAttributes<HTMLButtonElement>>) {
  return (
    <button data-testid={testId} {...props}>
      {children}
    </button>
  );
});

// Usage:
<EnhancedButton testId="enhanced-button" variant="secondary">
  Enhanced Button
</EnhancedButton>;
// Results in: data-testid="enhanced-button.EnhancedButton"
```

### Example 3: Wrapper Component for Layout

```typescript
const Wrapper = withTestId(function Wrapper({
  testId,
  children,
  ...props
}: PropsWithTestId<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div data-testid={testId} {...props}>
      {children}
    </div>
  );
});

// Usage:
<Wrapper className="example-section">
  <h2>Section Title</h2>
  <p>Section content</p>
</Wrapper>;
// Results in: data-testid="Wrapper"
```

### Example 4: Nested Component Hierarchy

```typescript
// When components are nested, test IDs build hierarchically:
<Wrapper testId="parent">
  <Wrapper className="example-section">
    <Button testId="nested-button">Click me</Button>
  </Wrapper>
</Wrapper>

// Results in:
// - data-testid="parent.Wrapper" (parent wrapper)
// - data-testid="parent.Wrapper.Wrapper" (nested wrapper)
// - data-testid="nested-button.Button" (button)
```

### Key Benefits of the HOC Approach

1. **Automatic ID Generation**: Component names are automatically included
2. **Type Safety**: Full TypeScript support with `PropsWithTestId<T>`
3. **Hierarchical Structure**: Test IDs build up naturally when components are nested
4. **Simple API**: Just two main exports: `withTestId` and `testIdAttr`
5. **Performance**: No hooks overhead, just simple string concatenation

## 🔧 Build-Time Automation

For even more automation, you can use our plugins to automatically inject `data-testid` attributes at build time without needing to wrap components or manually add test IDs:

### Babel Plugin (Most Compatible)

Perfect for Vite, Create React App, and custom Babel setups:

**Installation:**

```bash
npm install --save-dev @pablohpsilva/babel-plugin-auto-testid
```

### Configuration

```javascript
// babel.config.js
module.exports = {
  plugins: [
    [
      "@pablohpsilva/babel-plugin-auto-testid",
      {
        // Only add in test environment
        enabled: process.env.NODE_ENV === "test",
      },
    ],
  ],
};
```

### Before (your original code)

```jsx
function UserCard({ user }) {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}
```

### After (automatically transformed)

```jsx
function UserCard({ user }) {
  return (
    <div className="user-card" data-testid="UserCard.div">
      <h2 data-testid="UserCard.h2">{user.name}</h2>
      <button onClick={handleEdit} data-testid="UserCard.button">
        Edit
      </button>
    </div>
  );
}
```

### Benefits

- ✅ **Zero Runtime Cost**: Applied at build time only
- ✅ **No Code Changes**: Works with existing components
- ✅ **Automatic Hierarchy**: Builds logical test ID paths
- ✅ **Environment Specific**: Only active when needed (tests/development)
- ✅ **Framework Agnostic**: Works with React, Next.js, Vite, etc.

### SWC Plugin (Next.js 12+)

Native Rust-based plugin for optimal performance with Next.js:

**Installation:**

1. Download `swc_plugin_auto_testid.wasm` from our [releases](./swc-plugin-auto-testid/)
2. Place it in your project root
3. Configure in `next.config.js` (see [Next.js Integration](#-nextjs-integration))

**Benefits:**

- ✅ **Native Performance**: Written in Rust, compiled to WebAssembly
- ✅ **SWC Compatible**: Works with Next.js default compiler
- ✅ **Zero Dependencies**: No additional npm packages needed
- ✅ **Future-Proof**: Built for Next.js modern stack

See the [`plugins/`](./plugins/) and [`swc-plugin-auto-testid/`](./swc-plugin-auto-testid/) directories for complete documentation and setup examples.

## 🔧 Next.js Integration

For Next.js applications (which use SWC by default instead of Babel), we provide multiple integration approaches:

### Approach 1: SWC Plugin (Recommended - Next.js 12+)

Our custom SWC plugin provides the best performance and native integration with Next.js:

```javascript
// next.config.js
const path = require("path");

module.exports = {
  experimental: {
    swcPlugins: [
      [
        path.resolve("./swc_plugin_auto_testid.wasm"),
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

**Setup Instructions:**

1. Download `swc_plugin_auto_testid.wasm` from our releases
2. Place it in your Next.js project root
3. Add the configuration above to `next.config.js`
4. Restart your development server

**Benefits:**

- ✅ Native SWC integration (faster than Babel)
- ✅ Works with Next.js default compiler
- ✅ No additional dependencies
- ✅ Automatic test ID generation at build time

### Approach 2: Babel Configuration (Alternative)

```javascript
// .babelrc
{
  "presets": ["next/babel"],
  "plugins": [
    ["@pablohpsilva/babel-plugin-auto-testid", {
      "separator": ".",
      "includeElement": true,
      "useHierarchy": true,
      "skipElements": ["br", "hr", "img", "svg"]
    }]
  ]
}
```

When `.babelrc` is present, Next.js automatically uses Babel instead of SWC.

### Approach 2: Webpack Plugin

```javascript
// next.config.js
const AutoTestIdWebpackPlugin = require("@pablohpsilva/webpack-plugin-auto-testid");

module.exports = {
  webpack: (config, { dev }) => {
    if (dev || process.env.NODE_ENV === "test") {
      config.plugins.push(new AutoTestIdWebpackPlugin());
    }
    return config;
  },
};
```

This approach keeps SWC for main compilation and only uses Babel for test ID transformation.

### Approach 3: SWC Plugin (Future)

```javascript
// next.config.js
module.exports = {
  experimental: {
    swcPlugins: [["@pablohpsilva/swc-plugin-auto-testid", {}]],
  },
};
```

_Note: SWC plugin is in development. Use Babel or Webpack approaches for now._

### Running Examples

```bash
# React + Vite + Babel
cd examples-babel-plugin
npm install && npm run dev

# Next.js Examples
cd examples-nextjs
npm install && npm run dev

# View at http://localhost:3000
```

The examples provide working demonstrations with visual output and generated test IDs that you can inspect in browser dev tools.
