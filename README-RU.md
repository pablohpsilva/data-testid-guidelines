# Руководство по определению data-testid в React приложениях

* [EN](/#README.md)
* [ES](/#README-ES.md)
* [FR](/#README-FR.md)
* [JP](/#README-JP.md)
* [LU](/#README-LG.md)
* [PT-BR](/#README-PTBR.md)
* [RU](/#README-RU.md)

Создание предсказуемых, уникальных и надежных атрибутов `data-testid` необходимо для обеспечения устойчивых и поддерживаемых тестов. Это руководство предоставляет лучшие практики, примеры и общие шаблоны для определения атрибутов `data-testid` в ваших приложениях на React (или в любых других).

## Почему использовать data-testid?

- **Последовательность**: Обеспечивает единообразный способ идентификации элементов в разных наборах тестов.
- **Стабильность**: Менее подвержен изменениям по сравнению с именами классов или текстовым содержимым, что делает тесты более надежными.
- **Ясность**: Улучшает читаемость тестов, четко указывая, какие элементы тестируются.

## Лучшие практики

- **Используйте семантические имена**: Используйте четкие и описательные имена, которые отражают назначение элемента. Избегайте общих имен.
- **Применяйте к ключевым элементам**: Применяйте `data-testid` к ключевым интерактивным элементам или тем, которые требуют прямого взаимодействия в тестах.
- **Не используйте для стилей**: `data-testid` должен использоваться исключительно для тестирования и не для стилей или другой логики.
- **Сохраняйте уникальность идентификаторов**: Убедитесь, что значения `data-testid` уникальны в пределах вашего приложения, чтобы избежать конфликтов.

## Руководство по определению data-testid

- **Используйте Pascal Case** (например, `MyComponent`) для компонентов и camel case (например, `section`) для элементов.
  - **Хорошо**:
    - Четко указывает происхождение и назначение элемента.
    - Добавляет специфичность, делая его уникальным и предсказуемым.
    - Снижает вероятность дублирования.
    - Обеспечивает четкую иерархию для отладки.
      - Например: `MyComponent.NameList.NameListItem.0.label` показывает происхождение и иерархию элемента.
    - Игнорирование этого руководства может привести к потере вышеупомянутых преимуществ в зависимости от уровня зрелости вашей команды в создании и поддержке этих `data-testid`.
  - **Плохо**:
    - Имена могут стать длинными по мере углубления в DOM-дерево.
    - Требуется больше времени на написание тестов.
- **Создайте простой тип/интерфейс**, который можно расширить, полагаясь на свойство `testId` для ваших компонентов.
  - **Хорошо**:
    - Избегает повторения за счет использования повторно используемого интерфейса.
    - Автоматически защищает от будущих изменений.
    - Четко идентифицирует компоненты, которые поддерживают или нуждаются в `data-testid`.
  - **Плохо**:
    - В текущих проектах потребуется создать и применить этот тип во многих файлах.
- **Используйте специфическое свойство компонента `testId`**:
  - **Хорошо**:
    - Обеспечивает уникальность за счет сочетания имен родительских и дочерних компонентов.
    - Упрощает идентификацию и взаимодействие с элементами.
  - **Плохо**:
    - Может привести к длинным значениям `data-testid`, что может быть неудобно.
- **Используйте `.` (точку) в качестве разделителя**:
  - **Хорошо**:
    - Обеспечивает четкую цепочку информации.
    - Визуально более привлекательно, чем другие разделители.
  - **Плохо**:
    - Некоторым это может не понравиться, хотя существенных недостатков не отмечено.

## Добавление data-testid в ваши компоненты

Мы рекомендуем присваивать уникальные тестовые идентификаторы элементам, с которыми вы планируете взаимодействовать в своих тестах. Использование этих идентификаторов более надежно, чем использование других атрибутов, таких как необработанный текст, который может часто меняться и варьироваться в зависимости от локали. Кроме того, использование уникальных тестовых идентификаторов по всему приложению упрощает процесс идентификации и взаимодействия с конкретными элементами, улучшая читаемость кода и облегчая навигацию и поддержку вашего кода.

Следующие примеры должны охватывать большинство (если не все) возможных сценариев и следовать всем лучшим практикам.

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
          <span
            data-testid={`${componentName}.nameList.item.${index}`}
          >
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

В приведенном выше примере вы можете четко увидеть все возможные data-testids и их поведение. Вот список уникальных data-testids, учитывая использование компонента MainComponent:

```
<MainComponent
  title="Component title"
  description="nice description"
  nameList={["ana", "bob", "kostantine"]}
/>
```

Вот список сгенерированных data-testid:

<img src="images/rendered.png" alt="отрендеренные компоненты с отображением data-testid">

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

## Добавление data-testid к нескольким блокам

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

Вот список сгенерированных data-testid:

```
MainComponent.section.heading
MainComponent.section.description
MainComponent.block.nameList.item.0
MainComponent.block.nameList.item.1
MainComponent.block.nameList.item.2
```
