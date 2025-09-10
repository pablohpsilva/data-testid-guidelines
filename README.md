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
