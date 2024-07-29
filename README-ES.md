# Directrices para Definir `data-testid` en Aplicaciones React

* [EN](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README.md)
* [ES](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-ES.md)
* [FR](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-FR.md)
* [JP](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-JP.md)
* [LU](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-LG.md)
* [PT-BR](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-PTBR.md)
* [RU](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-RU.md)

Crear atributos `data-testid` predecibles, únicos y confiables es esencial para garantizar pruebas robustas y mantenibles. Esta guía proporciona mejores prácticas, ejemplos y patrones comunes para definir atributos `data-testid` en tus aplicaciones React (o básicamente en cualquier aplicación).

## ¿Por qué Usar `data-testid`?

- **Consistencia**: Proporciona una forma consistente de identificar elementos en diferentes suites de pruebas.
- **Estabilidad**: Es menos probable que cambie en comparación con los nombres de clases o el contenido de texto, lo que hace que las pruebas sean más confiables.
- **Claridad**: Mejora la legibilidad de las pruebas al indicar claramente qué elementos se están seleccionando.

## Mejores Prácticas

- **Usar Nombres Semánticos**: Usar nombres claros y descriptivos que reflejen el propósito del elemento. Evitar nombres genéricos.
- **Aplicar Solo a Elementos Clave**: Aplicar `data-testid` a elementos interactivos clave o a aquellos que requieren interacción directa en las pruebas.
- **Evitar Usar para Estilizar**: El `data-testid` debe usarse exclusivamente para fines de prueba y no para estilizar o para otra lógica.
- **Mantener IDs Únicos**: Asegurarse de que los valores de `data-testid` sean únicos dentro del alcance de tu aplicación para evitar conflictos.

## Directrices para Definir `data-testid`

- **Usar Pascal Case** (por ejemplo, `MyComponent`) para componentes y camel case (por ejemplo, `section`) para elementos.
  - **Bueno**:
    - Indica claramente el origen y propósito del elemento.
    - Agrega especificidad, haciéndolo único y predecible.
    - Reduce la probabilidad de duplicación.
    - Proporciona una jerarquía clara para depurar.
      - Ejemplo: `MyComponent.NameList.NameListItem.0.label` muestra el origen y la jerarquía del elemento.
    - Ignorar esta directriz podría llevar a la pérdida de los beneficios anteriores, dependiendo de la madurez de tu equipo en crear y mantener estos `data-testid`.
  - **Malo**:
    - Los nombres pueden volverse largos cuanto más profundo vayas en el árbol DOM.
    - Requiere más escritura al redactar pruebas.
- **Crear un Tipo/Interfaz Simple** que pueda expandirse basándose en una propiedad llamada `testId` para tus componentes.
  - **Bueno**:
    - Evita la repetición teniendo una interfaz reutilizable.
    - Protege automáticamente contra cambios futuros.
    - Identifica claramente componentes que soportan o necesitan un `data-testid`.
  - **Malo**:
    - En proyectos en curso, necesitarás crear y aplicar este tipo en muchos archivos.
- **Usar la Propiedad Específica del Componente `testId`**:
  - **Bueno**:
    - Asegura unicidad combinando nombres de componentes padre e hijo.
    - Simplifica la identificación e interacción con los elementos.
  - **Malo**:
    - Puede resultar en valores largos de `data-testid`, que pueden ser engorrosos.
- **Usar `.` (Punto) como Separador**:
  - **Bueno**:
    - Proporciona una cadena clara de información.
    - Visualmente más atractivo que otros separadores.
  - **Malo**:
    - Algunos pueden no preferirlo, aunque no se notan desventajas significativas.

## Agregar `data-testid` a tus Componentes

Sugerimos asignar IDs de prueba únicos a los elementos con los que planeas interactuar en tus pruebas. Confiar en estos IDs es más confiable que usar otros atributos, como texto sin formato, que pueden cambiar frecuentemente y variar según la ubicación. Además, usar IDs de prueba únicos en toda tu aplicación simplifica el proceso de identificar e interactuar con elementos específicos, mejorando la legibilidad del código y facilitando la navegación y el mantenimiento de tu base de código.

Los siguientes ejemplos deberían cubrir la mayoría (si no todos) de los posibles escenarios y seguir todas las mejores prácticas.

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
        Ejemplo de un bucle, sin componentes adicionales
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
        Ejemplo de un bucle, CON componentes adicionales
      </p>
      <NameList items={nameList} testId={componentName} />
    </>
  );
};

// Este componente NO soporta ser independiente
const Heading: FC<PropsWithChildren<PropWithTestId>> = ({
  children,
  testId
}) => {
  return <h1 data-testid={`${testId}.Heading`}>{children}</h1>;
};

// Este componente soporta ser independiente
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

// Este componente NO soporta ser independiente
const NameListItem: FC<PropsWithChildren<
  { index: number } & PropWithTestId
>> = ({ children, index, testId }) => {
  const componentName = `${testId}.${NameListItem?.name}`;
  return <span data-testid={`${componentName}.${index}`}>{children}</span>;
};
```

En el ejemplo anterior, puedes ver claramente todos los posibles data-testid y cómo se comportan. Aquí tienes una lista de data-testid únicos, considerando el uso mencionado del componente MainComponent:

```
<MainComponent
  title="Component title"
  description="nice description"
  nameList={["ana", "bob", "kostantine"]}
/>
```

Aquí está la lista de data-testid generados:

<img src="images/rendered.png" alt="componentes renderizados con `data-testid` mostrados">

```
MainComponent.heading
MainComponent.description

// bucle regular
MainComponent.nameList.item.0
MainComponent.nameList.item.1
MainComponent.nameList.item.2

// bucle basado en componentes
MainComponent.NameList.NameListItem.0
MainComponent.NameList.NameListItem.1
MainComponent.NameList.NameListItem.2
```

## Agregar data-testid en múltiples bloques

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

Aquí está la lista de data-testid generados:
```
MainComponent.section.heading
MainComponent.section.description
MainComponent.block.nameList.item.0
MainComponent.block.nameList.item.1
MainComponent.block.nameList.item.2
```