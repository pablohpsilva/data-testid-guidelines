# Next.js with data-testid-guidelines-babel-plugin

This is a Next.js project that demonstrates the `data-testid-guidelines-babel-plugin` in action.

## Features Demonstrated

This example showcases all the key features of the Babel plugin:

### 1. **Basic Component testIds**

- Root DOM elements get component names
- Components like `<UserCard />` automatically get hierarchical testIds

### 2. **Hierarchical Structure**

- Child components inherit parent hierarchy: `Parent.Child.Subchild`
- Deep nesting is properly handled

### 3. **Loop Support**

- Components in `.map()` iterations get indexed testIds
- Format: `Parent.Component.${index}`

### 4. **Fragment Support**

- Components inside React.Fragment get proper parent context
- Both `<>` and `<React.Fragment>` syntax supported

### 5. **Existing Attribute Respect**

- Components with existing `data-testid` are not modified
- See `Navigation` component with `data-testid="custom-navigation"`

## Components Structure

```
Dashboard
├── Navigation (has existing data-testid)
│   ├── Logo
│   │   ├── LogoIcon
│   │   └── LogoText
│   ├── NavItems (loop)
│   │   └── NavItem.${index}
│   └── UserMenu
│       ├── UserAvatar
│       └── DropdownMenu
│           └── DropdownItem.${index}
├── Sidebar
│   ├── SidebarMenu
│   │   ├── MenuTitle
│   │   └── MenuItem.${index} (loop)
│   └── UserStats
│       ├── StatsTitle
│       └── StatsGrid
│           └── StatItem.${index} (loop)
│               ├── StatLabel
│               └── StatValue
├── MainContent
│   ├── WelcomeSection
│   │   ├── WelcomeTitle
│   │   ├── WelcomeMessage
│   │   └── QuickActions
│   │       └── QuickAction.${index} (loop)
│   ├── UserList
│   │   ├── Header
│   │   │   ├── Title
│   │   │   └── Subtitle
│   │   ├── SearchBar
│   │   │   ├── SearchInput
│   │   │   └── FilterButton
│   │   ├── UserCard.${index} (loop)
│   │   │   ├── Avatar (fragment)
│   │   │   │   ├── ProfileImage
│   │   │   │   └── StatusIndicator
│   │   │   ├── UserInfo
│   │   │   │   ├── UserName
│   │   │   │   └── UserEmail
│   │   │   └── ActionButtons
│   │   │       ├── EditButton
│   │   │       └── DeleteButton
│   │   └── Pagination
│   │       ├── PreviousButton
│   │       ├── PageNumbers
│   │       │   └── PageNumber.${index} (loop)
│   │       └── NextButton
│   └── RecentActivity
│       ├── ActivityTitle
│       └── ActivityList
│           └── ActivityItem.${index} (loop)
│               ├── ActivityIcon
│               └── ActivityDescription
└── Footer
    └── FooterContent
        ├── Copyright
        └── FooterLinks
            └── FooterLink.${index} (loop)
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Test the plugin directly:**

   ```bash
   node test-plugin.js
   ```

3. **Start the development server (optional):**

   ```bash
   npm run dev
   ```

4. **Open your browser (if using dev server):**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Quick Demo

The easiest way to see the plugin in action is to run the test script:

```bash
node test-plugin.js
```

This will show you exactly how the plugin transforms different React patterns:

- ✅ **Simple Components** → Root DOM elements get component names
- ✅ **Component Hierarchy** → Nested components get dot notation IDs
- ✅ **Fragment Support** → Components in fragments inherit parent context
- ✅ **Loop Support** → Array iterations get template literal indexing
- ✅ **Existing Attributes** → Respects manually set data-testid values

## Inspecting Generated testIds

1. Open the app in your browser
2. Right-click and "Inspect Element"
3. Look for `data-testid` attributes on components
4. Notice the hierarchical patterns and loop indexing

## Configuration

The plugin is configured in `.babelrc`:

```json
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "data-testid-guidelines-babel-plugin",
      {
        "attributeName": "data-testid",
        "autoGenerate": true,
        "respectExisting": true
      }
    ]
  ]
}
```

## Expected testId Patterns

You should see testIds like:

- `Dashboard` (root component)
- `Dashboard.Navigation` → `custom-navigation` (existing attribute respected)
- `Dashboard.Sidebar.SidebarMenu.MenuItem.0`
- `Dashboard.MainContent.UserList.UserCard.0.Avatar.ProfileImage`
- `Dashboard.MainContent.UserList.UserCard.1.ActionButtons.EditButton`
- And many more following the hierarchical pattern!

## Testing

You can write tests targeting these predictable testIds:

```javascript
// Example with React Testing Library
import { render, screen } from "@testing-library/react";

test("user card renders with correct testid", () => {
  render(<Dashboard users={mockUsers} />);

  // First user card
  const firstUserCard = screen.getByTestId(
    "Dashboard.MainContent.UserList.UserCard.0"
  );
  expect(firstUserCard).toBeInTheDocument();

  // Edit button for first user
  const editButton = screen.getByTestId(
    "Dashboard.MainContent.UserList.UserCard.0.ActionButtons.EditButton"
  );
  expect(editButton).toBeInTheDocument();
});
```

## Notes

- This example uses Babel instead of SWC for transformation
- The plugin automatically handles complex nesting and loops
- All testIds are predictable and follow consistent patterns
- No manual testId management required!
