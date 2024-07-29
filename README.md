# Guidelines for Defining data-testid's in React/Vue/Angular Applications

Creating predictable, unique, and reliable data-testid attributes is essential for ensuring robust and maintainable tests. This guide provides best practices, examples, and common patterns for defining data-testid attributes in your React (or basically any) applications.

## Why Use data-testid's?

- **Consistency**: Provides a consistent way to identify elements across different test suites.
- **Stability**: Less likely to change compared to class names or text content, making tests more reliable.
- **Clarity**: Improves the readability of tests by clearly indicating which elements are being targeted.

## Best Practices

- **Use semantic naming**: Use clear and descriptive names that reflect the purpose of the element. Avoid generic names.
- **Apply to Key Elements Only**: Apply data-testid to key interactive elements or those that require direct interaction in tests.
- **Avoid Using for Styling**: The data-testid should be used exclusively for testing purposes and not for styling or other logic.
- **Keep IDs Unique**: Ensure that data-testid values are unique within the scope of your application to avoid conflicts

## Defining data-testid Guidelines

- Use Pascal Case (e.g. `MyComponent`) for components and camel case (e.g. `section`) for elements;
  - Good
    - You can clearly see in the data-testid where it came from and what is what;
    - It adds entropy on the name making it very specific but also predictable in a sense;
    - It makes it hard to have a duplication;
    - The "chain" can tell you where the element originated from helping on debugging.
      - E.g.: `MyComponent.NameList.NameListItem.0.label` -> You can clearly see all the components where this data-testid came from, you can see it is a list, and you can see the element at hand is a `label`.
    - If you decide to ignore this guideline (using all PascalCase, or camelCase, or snake_case, or all uppercase, or all lowercased, ...) you might loose some of the benefits above-mentioned, depending, obviously, on how mature is your team on creating and maintaining these data-testid's.
  - Bad
    - Names will be long the lower you get down your DOM tree;
    - When writing tests you type more;
- Create a simple type/interface that can be expandable by relying on a property called `testId` for your components;
  - Good
    - By simply having an interface ([check examples](#adding-data-testid-to-your-components)) you can avoid repeating yourself;
    - Relying on a type can automatically protect you from future changes;
    - You will know exactly all the components that supports (or needs) a data-testid;
  - Bad
    - On an ongoing project, you'll have to create a type and apply it in a lot of files
- Whenever using component property `testId`, make sure to make them specific by either relying on the parent + the child component name or by simply having a well-defined naming system in place.
  - Good
    - if you rely on both the parent ([check examples](#adding-data-testid-to-your-components)) and the component name, you increase the possibility on having uniqueness in your system, guaranteeing one single element per data-testid.
    - If you rely on having a well-defined naming system, be extra careful NOT to add complexity to your testing team;
  - Bad
    - Again, the output data-testid can be long, and that can annoy people.
- As separator, use `.` (dot) instead of pipe (|), dash (-), or others.
  - Good
    - It is nice to see a "chain" (like an object in JavaScript) of information, especially to see where that specific data-testid came from;
    - Visually it looks nicer than having dashes, pipes, or other separators;
  - Bad
    - I couldn't think of any. Maybe because some people don't like it?

## Adding data-testid to your components

We suggest assigning unique test IDs to the elements you intend to interact with in your tests. Relying on these IDs is more reliable than using other attributes, like raw text, which can change frequently and vary by locale. Additionally, using unique test IDs throughout your application simplifies the process of identifying and interacting with specific elements, enhancing code readability and making it easier to navigate and maintain your codebase.

The following examples should cover most (if not all) possible scenarios and should follow all the best practices.

```
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
        Example of a lopp, no extra components
      </p>
      {nameList.map((name, index) => (
        <Fragment key={name}>
          <span
            // `${componentName}.nameList.item.${name}` OR:
            data-testid={`${componentName}.nameList.item.${index}`}
          >
            {name}
          </span>
          <br />
          <br />
        </Fragment>
      ))}

      <p data-testid={`${componentName}.exampleComponentLoop`}>
        Example of a lopp, WITH extra components
      </p>
      <NameList items={nameList} testId={componentName} />
    </>
  );
};

// This component DOES NOT support being standalone
const Heading: FC<PropsWithChildren<PropWithTestId>> = ({
  children,
  testId
}) => {
  return <h1 data-testid={`${testId}.Heading`}>{children}</h1>;
};

// This component supports being standalone
const NameList: FC<{ items: string[] } & Partial<PropWithTestId>> = ({
  items,
  testId
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
const NameListItem: FC<PropsWithChildren<
  { index: number } & PropWithTestId
>> = ({ children, index, testId }) => {
  const componentName = `${testId}.${NameListItem?.name}`;
  return <span data-testid={`${componentName}.${index}`}>{children}</span>;
};
```

In the example above you can clearly see all the possible data-testid's and how they behave. Here's a list of unique data-testid's, considering the below-mentioned `MainComponent` component usage:

```
<MainComponent
  title="Component title"
  description="nice description"
  nameList={["ana", "bob", "kostantine"]}
  // testId="WhateverYouWant" but let's skip this for now
/>
```

Here's the list of generated data-testid's:

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
