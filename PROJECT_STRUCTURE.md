# Data TestID Guidelines Project Structure

## Project Overview

This project provides comprehensive guidelines for defining `data-testid` attributes in React applications. The goal is to create predictable, unique, and reliable test identifiers that make testing more robust and maintainable.

## Project Purpose

### Core Objectives

- **Consistency**: Establish uniform patterns for identifying elements across test suites
- **Stability**: Create test identifiers that are less prone to change than class names or text content
- **Clarity**: Improve test readability by clearly indicating targeted elements
- **Maintainability**: Reduce test brittleness and improve long-term maintenance

## Key Components

### 1. Guidelines and Best Practices

- **Semantic Naming**: Use descriptive names reflecting element purpose
- **Selective Application**: Apply only to key interactive elements
- **Testing-Only Purpose**: Avoid using for styling or other logic
- **Uniqueness**: Ensure unique IDs within application scope

### 2. Naming Conventions

- **Component Naming**: Pascal Case (e.g., `MyComponent`)
- **Element Naming**: Camel case (e.g., `section`)
- **Separator**: Use dot (`.`) as hierarchical separator
- **Hierarchy**: `Component.SubComponent.Element.Index` structure

### 3. TypeScript Integration

```typescript
type PropWithTestId = { testId: string };
```

- Standardized interface for components
- Optional testId support with `Partial<PropWithTestId>`
- Component name fallback when testId not provided

## Technical Implementation

### Babel Plugin Requirements

The goal is to create a Babel plugin that automatically adds `data-testid` attributes to React components following predictable, hierarchical patterns. The plugin should focus on **React components only** (uppercase JSX elements) and generate test IDs that reflect component hierarchy and loop positions.

#### Core Plugin Rules

**Rule 1: Component Detection and ID Assignment**

- **Target**: Only custom React components (uppercase JSX elements like `<MyComponent />`)
- **Action**: Add `data-testid` with the component's name
- **Example**: `<UserProfile />` → `<UserProfile data-testid="UserProfile" />`

**Rule 1.1: Fragment Propagation**

- **Scenario**: When a component renders React.Fragment with child components
- **Action**: Child components inherit parent's testId as prefix
- **Example**:

  ```jsx
  // Input
  const Parent = () => (
    <>
      <Child1 />
      <Child2 />
    </>
  );

  // Output
  const Parent = () => (
    <>
      <Child1 data-testid="Parent.Child1" />
      <Child2 data-testid="Parent.Child2" />
    </>
  );
  ```

**Rule 2: Loop Detection and Indexing**

- **Target**: Components rendered within iteration patterns (`.map()`, etc.)
- **Format**: `[Parent-data-testid].[Component-name].[index]`
- **Example**:

  ```jsx
  // Input
  const Parent = () => (
    <div>
      {items.map((item, index) => (
        <ItemComponent key={item} data={item} />
      ))}
    </div>
  );

  // Output
  const Parent = () => (
    <div data-testid="Parent">
      {items.map((item, index) => (
        <ItemComponent
          key={item}
          data={item}
          data-testid="Parent.ItemComponent.0"
        />
        // ItemComponent.1, ItemComponent.2, etc.
      ))}
    </div>
  );
  ```

**Rule 2.1: Nested Components in Loops**

- **Scenario**: Components within loop-rendered components
- **Format**: `[Parent-testid].[Loop-Component].[index].[Nested-Component]`
- **Example**:

  ```jsx
  // If ItemComponent contains nested components:
  const ItemComponent = ({ data }) => (
    <div data-testid="ItemComponent">
      <Label text={data} />
      <Button onClick={() => {}} />
    </div>
  );

  // Nested components get:
  // Label: data-testid="Parent.ItemComponent.0.Label"
  // Button: data-testid="Parent.ItemComponent.0.Button"
  ```

**Rule 3: Root DOM Elements**

- **Target**: DOM elements (lowercase) that are root elements of components
- **Action**: Add component name as `data-testid`
- **Exclusion**: Skip DOM elements that are not root elements
- **Example**:

  ```jsx
  // This div gets data-testid="MyComponent"
  const MyComponent = () => <div>Content</div>;

  // These inner DOM elements are skipped
  const MyComponent = () => (
    <div>
      {" "}
      {/* Gets data-testid="MyComponent" */}
      <span>Inner content</span> {/* Skipped */}
      <p>More content</p> {/* Skipped */}
    </div>
  );
  ```

#### Technical Implementation Details

**1. Component Name Resolution**

- Handle function declarations: `function MyComponent() {}`
- Handle arrow functions: `const MyComponent = () => {}`
- Handle variable assignments: `const MyComponent = function() {}`
- Handle anonymous functions by using parent context

**2. Context Tracking**

- Maintain a stack of component contexts to build proper hierarchies
- Track current component name and testId prefix
- Handle nested component relationships

**3. Loop Detection**

- Identify `.map()`, `.forEach()`, and other iteration patterns
- Extract index parameter from iteration callbacks
- Generate indexed testIds for loop elements

**4. Fragment Handling**

- Detect React.Fragment (`<>`, `<React.Fragment>`)
- Propagate parent component testId to direct children
- Maintain hierarchy through fragment boundaries

**5. DOM Element Processing**

- Only process DOM elements when they are root elements of components
- Use component name as testId for root DOM elements
- Skip all other DOM elements to avoid clutter

#### Plugin Architecture

**State Management**

```typescript
interface PluginState {
  componentStack: string[]; // Track component hierarchy
  currentComponent: string; // Current component name
  isInLoop: boolean; // Whether currently processing a loop
  loopIndex: string; // Current loop index variable name
}
```

**Core Visitors**

- `JSXElement`: Process React components and root DOM elements
- `CallExpression`: Detect array iteration methods (map, forEach)
- `FunctionDeclaration/ArrowFunctionExpression`: Track component contexts
- `JSXFragment`: Handle fragment propagation

### Best Practices Demonstrated

- Consistent naming conventions (PascalCase for components)
- Clear component hierarchy with dot notation
- Predictable ID generation based on component structure
- Scalable pattern application for complex nested scenarios
- Loop-aware indexing for dynamic content

#### Expected Transformations

**1. Simple Component**

```jsx
// Input
const UserCard = () => <div>User info</div>;

// Output
const UserCard = () => <div data-testid="UserCard">User info</div>;
```

**2. Component with Child Components**

```jsx
// Input
const UserProfile = () => (
  <div>
    <Avatar />
    <UserInfo />
  </div>
);

// Output
const UserProfile = () => (
  <div data-testid="UserProfile">
    <Avatar data-testid="UserProfile.Avatar" />
    <UserInfo data-testid="UserProfile.UserInfo" />
  </div>
);
```

**3. Fragment with Children**

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

**4. Loop Rendering**

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
      <UserCard key={user.id} user={user} data-testid="UserList.UserCard.0" />
      // UserCard.1, UserCard.2, etc.
    ))}
  </div>
);
```

**5. Nested Components in Loop**

```jsx
// Input
const UserCard = ({ user }) => (
  <div>
    <Avatar src={user.avatar} />
    <UserName name={user.name} />
    <ActionButton />
  </div>
);

// When UserCard is rendered in UserList loop:
// Output (for first item)
const UserCard = ({ user }) => (
  <div data-testid="UserCard">
    <Avatar src={user.avatar} data-testid="UserList.UserCard.0.Avatar" />
    <UserName name={user.name} data-testid="UserList.UserCard.0.UserName" />
    <ActionButton data-testid="UserList.UserCard.0.ActionButton" />
  </div>
);
```

**6. Complex Nested Structure**

```jsx
// Input
const Dashboard = () => (
  <div>
    <Header />
    <Sidebar>
      <Navigation />
      <UserMenu />
    </Sidebar>
    <MainContent>
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post}>
          <PostHeader />
          <PostBody />
          <PostActions>
            <LikeButton />
            <ShareButton />
          </PostActions>
        </PostCard>
      ))}
    </MainContent>
  </div>
);

// Output (showing first post)
const Dashboard = () => (
  <div data-testid="Dashboard">
    <Header data-testid="Dashboard.Header" />
    <Sidebar data-testid="Dashboard.Sidebar">
      <Navigation data-testid="Dashboard.Sidebar.Navigation" />
      <UserMenu data-testid="Dashboard.Sidebar.UserMenu" />
    </Sidebar>
    <MainContent data-testid="Dashboard.MainContent">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          data-testid="Dashboard.MainContent.PostCard.0"
        >
          <PostHeader data-testid="Dashboard.MainContent.PostCard.0.PostHeader" />
          <PostBody data-testid="Dashboard.MainContent.PostCard.0.PostBody" />
          <PostActions data-testid="Dashboard.MainContent.PostCard.0.PostActions">
            <LikeButton data-testid="Dashboard.MainContent.PostCard.0.PostActions.LikeButton" />
            <ShareButton data-testid="Dashboard.MainContent.PostCard.0.PostActions.ShareButton" />
          </PostActions>
        </PostCard>
      ))}
    </MainContent>
  </div>
);
```

#### Edge Cases and Considerations

**1. Existing data-testid Attributes**

- **Behavior**: Never override existing `data-testid` attributes
- **Reason**: Respect developer's explicit choices

**2. Multiple Loops in Same Component**

```jsx
const MultiList = () => (
  <div>
    {users.map((user, index) => (
      <UserCard key={user.id} />
    ))}
    {posts.map((post, index) => (
      <PostCard key={post.id} />
    ))}
  </div>
);

// Should generate:
// UserCard.0, UserCard.1, etc.
// PostCard.0, PostCard.1, etc.
```

**3. Nested Loops**

```jsx
const Categories = () => (
  <div>
    {categories.map((category, catIndex) => (
      <Category key={category.id}>
        {category.items.map((item, itemIndex) => (
          <Item key={item.id} />
        ))}
      </Category>
    ))}
  </div>
);

// Should generate:
// Categories.Category.0, Categories.Category.1
// Categories.Category.0.Item.0, Categories.Category.0.Item.1
// Categories.Category.1.Item.0, Categories.Category.1.Item.1
```

**4. Anonymous Functions**

```jsx
// Input
export default () => <div><UserCard /></div>;

// Output (fallback to file name or "Component")
export default () => <div data-testid="Component"><UserCard data-testid="Component.UserCard" /></div>;
```

**5. Higher-Order Components**

```jsx
const withAuth = (WrappedComponent) => {
  return (props) => <WrappedComponent {...props} />;
};

// Should handle component name resolution through HOC patterns
```

#### Performance Considerations

- **Selective Processing**: Only process components, skip unnecessary DOM elements
- **Efficient Traversal**: Use visitor pattern efficiently, avoid unnecessary tree walks
- **Memory Management**: Clean up context stack appropriately
- **Build Time Impact**: Minimize transformation overhead

#### Integration Requirements

- **TypeScript Support**: Handle TypeScript JSX syntax
- **React Version Compatibility**: Support React 16.8+ (hooks era)
- **Build Tool Integration**: Work with Webpack, Vite, Create React App
- **Development vs Production**: Option to disable in production builds

## Project Goals

### Primary Goals

- Establish industry-standard guidelines for React testing
- Provide practical, implementable patterns
- Reduce test maintenance overhead
- Improve test reliability and debugging

### Secondary Goals

- Multi-language documentation support
- Developer tooling (Babel plugin)
- Visual documentation with examples
- Community adoption facilitation

## Current State Analysis

### Completed Components

- ✅ Comprehensive documentation
- ✅ Multiple language translations
- ✅ Practical code examples
- ✅ Visual documentation (images/rendered.png)
- ✅ Babel plugin development (in packages/)

### Development Status

- Project appears to be in active development (feat/plugin branch)
- Babel plugin implementation in progress
- Documentation is comprehensive and mature

## Development Considerations

### Strengths

- Well-documented patterns
- Clear examples with practical implementations
- Multi-language support
- Tooling support via Babel plugin

### Potential Areas for Enhancement

- Test suite examples
- Integration guides for popular testing frameworks
- Performance considerations documentation
- Migration guides for existing projects

## Usage Patterns

### For New Projects

- Implement `PropWithTestId` interface from start
- Apply naming conventions consistently
- Use component name fallbacks

### For Existing Projects

- Gradual adoption possible
- Focus on key interactive elements first
- Refactor incrementally

## Conclusion

This project provides a comprehensive, well-thought-out approach to test identifier management in React applications. The guidelines are practical, the examples are clear, and the multi-language support demonstrates commitment to broad adoption. The inclusion of tooling (Babel plugin) shows a complete solution approach beyond just documentation.
