# Richtlinnen fir d'Definéiere vun data-testid's an React Uwendungen

* [EN](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README.md)
* [ES](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-ES.md)
* [FR](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-FR.md)
* [JP](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-JP.md)
* [LU](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-LG.md)
* [PT-BR](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-PTBR.md)
* [RU](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-RU.md)

Et ass essentiel fir virstellbar, eenzegaarteg, an zouverlässeg `data-testid` Attributer ze kreéieren fir robust an ënnerhalbar Tester ze garantéieren. Dës Richtlinn bitt bescht Praktiken, Beispiller, a gemeinsam Musteren fir `data-testid` Attributer an ären React (oder basically all) Uwendungen ze definéieren.

## Firwat data-testid's benotzen?

- **Konsistenz**: Bitt e konsistente Wee fir Elementer iwwer verschidden Test Suiten z'identifizéieren.
- **Stabilitéit**: Manner wahrscheinlech ze änneren am Verglach mat Klassennimm oder Textinhalt, wat Tester méi zouverlässeg mécht.
- **Klarheet**: Verbessert d'Liesbarkeet vun den Tester andeems et kloer ugëtt, wéi Elementer gezielt ginn.

## Bescht Praktiken

- **Benotzt Semantesch Benennung**: Benotzt kloer a beschreiwend Nimm déi den Zweck vum Element reflektéieren. Vermeit generesch Nimm.
- **Uwend op Schlüsselen Elementer Nëmmen**: Uwend `data-testid` op Schlëssel interaktiv Elementer oder déi, déi direkt Interaktioun an den Tester erfuerderen.
- **Vermeit fir Styling ze benotzen**: Den `data-testid` soll ausschliesslech fir Testzwecker benotzt ginn an net fir Styling oder aner Logik.
- **Halt IDs eenzegaarteg**: Sécherstellen datt `data-testid` Wäerter eenzegaarteg sinn am Kader vun ären Uwendungen fir Konflikter ze vermeiden.

## Definéieren vu data-testid Richtlinnen

- **Benotzt Pascal Case** (z.B. `MyComponent`) fir Komponenten an camel case (z.B. `section`) fir Elementer.
  - **Gutt**:
    - Kloer Uginn den Ursprong an Zweck vum Element.
    - Füügt Spezifizitéit bäi, wat et eenzegaarteg a virstellbar mécht.
    - Reduzéiert d'Wahrscheinlechkeet vun Duplikatioun.
    - Bitt eng kloer Hierarchie fir Feelerbehandlung.
      - Z.B.: `MyComponent.NameList.NameListItem.0.label` weist den Ursprong an d'Hierarchie vum Element.
    - Dës Richtlinn ignoréieren kéint zu engem Verloscht vun den uewe genannten Virdeeler féieren, ofhängeg vun der Reife vun ärem Team beim Schafen an Ënnerhalen vun dësen `data-testid`s.
  - **Schlecht**:
    - Nimm kënne laang ginn, je méi déif Dir an den DOM Bam gitt.
    - Erfuerdert méi Tippen wann Dir Tester schreift.
- **Erstellt eng Einfach Typ/Interface** déi ka verlängert ginn duerch d'Benotzung vun enger Eegeschaft genannt `testId` fir ären Komponenten.
  - **Gutt**:
    - Vermeit Widderhuelung duerch eng widderbenutzbar Interface.
    - Automatesch geschützt géint zukünfteg Ännerungen.
    - Kloer identifizéiert Komponenten déi ënnerstëtzen oder en `data-testid` brauchen.
  - **Schlecht**:
    - Bei lafende Projeten, musst Dir dësen Typ an ville Dateien erstellen an uwenden.
- **Benotzt Spezifesch Komponent Eegeschaft `testId`**:
  - **Gutt**:
    - Sécherstellt Eenheetlechkeet duerch Kombinéieren vu Parentesch a Kandkomponent Nimm.
    - Vereinfaacht d'Identifizéieren an Interagéieren mat Elementer.
  - **Schlecht**:
    - Kann zu laangen `data-testid` Wäerter féieren, déi onhandlech kënne sinn.
- **Benotzt `.` (Punkt) als Trennzeechen**:
  - **Gutt**:
    - Bitt eng kloer Kette vun Informatiounen.
    - Visuell méi attraktiv wéi aner Trennzeechen.
  - **Schlecht**:
    - E puer kënnen et net gär hunn, obwuel keng bedeitend Nodeeler festgestallt goufen.

## Adding data-testid to Your Components

Mir roden eenzegaarteg Test IDs den Elementer zouzeweisen, mat deenen Dir an ären Tester wëllt interagéieren. Op dës IDs vertrauen ass méi zouverlässeg wéi aner Attributer ze benotzen, wéi rouen Text, deen dacks ännere kann a jee no Lokal variéiert. Zousätzlech, eenzegaarteg Test IDs duerch Är Uwendung ze benotzen vereinfacht de Prozess vum Identifizéieren an Interagéieren mat spezifeschen Elementer, verbessert d'Code Liesbarkeet a mécht et méi einfach Är Codebasis ze navigéieren an ze ënnerhalen.

Déi folgend Beispiller solle meeschtens (wann net all) méiglech Szenarie ofdecken an all bescht Praktiken verfollegen.

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

Am Beispill hei uewen kënnt Dir kloer all méiglech data-testids gesinn a wéi se sech behuelen. Hei ass eng Lëscht vun eenzegaartegen data-testids, berécksiichtegt d'Benotzung vun der hei ënnendrënner MainComponent Komponent:

```
<MainComponent
  title="Component title"
  description="nice description"
  nameList={["ana", "bob", "kostantine"]}
/>
```

Hei ass d'Lëscht vun generéierten data-testid's:

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

## Adding data-testid's op méi Blocken

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

Hei ass d'Lëscht vun generéierten data-testid's:

```
MainComponent.section.heading
MainComponent.section.description
MainComponent.block.nameList.item.0
MainComponent.block.nameList.item.1
MainComponent.block.nameList.item.2
```
