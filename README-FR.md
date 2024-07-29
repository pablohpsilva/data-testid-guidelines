# Directives pour Définir les data-testid dans les Applications React

* [EN](/#README.md)
* [ES](/#README-ES.md)
* [FR](/#README-FR.md)
* [JP](/#README-JP.md)
* [LU](/#README-LG.md)
* [PT-BR](/#README-PTBR.md)
* [RU](/#README-RU.md)

Créer des attributs `data-testid` prévisibles, uniques et fiables est essentiel pour garantir des tests robustes et maintenables. Ce guide fournit des meilleures pratiques, des exemples et des modèles courants pour définir des attributs `data-testid` dans vos applications React (ou toute autre application).

## Pourquoi Utiliser des data-testid ?

- **Cohérence** : Fournit une manière cohérente d'identifier les éléments dans différentes suites de tests.
- **Stabilité** : Moins susceptible de changer par rapport aux noms de classes ou au contenu textuel, rendant les tests plus fiables.
- **Clarté** : Améliore la lisibilité des tests en indiquant clairement les éléments ciblés.

## Meilleures Pratiques

- **Utiliser des Noms Sémantiques** : Utiliser des noms clairs et descriptifs qui reflètent le but de l'élément. Évitez les noms génériques.
- **Appliquer aux Éléments Clés Seulement** : Appliquez `data-testid` aux éléments interactifs clés ou à ceux nécessitant une interaction directe dans les tests.
- **Éviter l'Utilisation pour le Style** : Le `data-testid` doit être utilisé exclusivement à des fins de test et non pour le style ou d'autres logiques.
- **Garder les ID Uniques** : Assurez-vous que les valeurs `data-testid` sont uniques dans le cadre de votre application pour éviter les conflits.

## Directives pour Définir les data-testid

- **Utiliser la Casse Pascal** (par exemple `MyComponent`) pour les composants et la casse camel (par exemple `section`) pour les éléments.
  - **Bon** :
    - Indique clairement l'origine et le but de l'élément.
    - Ajoute de la spécificité, le rendant unique et prévisible.
    - Réduit la probabilité de duplication.
    - Fournit une hiérarchie claire pour le débogage.
      - Par exemple : `MyComponent.NameList.NameListItem.0.label` montre l'origine et la hiérarchie de l'élément.
    - Ignorer cette directive peut entraîner la perte des avantages ci-dessus, selon la maturité de votre équipe dans la création et la maintenance de ces `data-testid`.
  - **Mauvais** :
    - Les noms peuvent devenir longs plus vous descendez dans l'arborescence DOM.
    - Nécessite plus de frappe lors de l'écriture des tests.
- **Créer un Type/Interface Simple** qui peut être étendu en s'appuyant sur une propriété appelée `testId` pour vos composants.
  - **Bon** :
    - Évite la répétition en ayant une interface réutilisable.
    - Protège automatiquement contre les changements futurs.
    - Identifie clairement les composants qui prennent en charge ou nécessitent un `data-testid`.
  - **Mauvais** :
    - Dans les projets en cours, vous devrez créer et appliquer ce type dans de nombreux fichiers.
- **Utiliser une Propriété Spécifique de Composant `testId`** :
  - **Bon** :
    - Assure l'unicité en combinant les noms des composants parent et enfant.
    - Simplifie l'identification et l'interaction avec les éléments.
  - **Mauvais** :
    - Peut entraîner des valeurs `data-testid` longues, ce qui peut être encombrant.
- **Utiliser le `.` (Point) comme Séparateur** :
  - **Bon** :
    - Fournit une chaîne d'informations claire.
    - Visuellement plus attrayant que d'autres séparateurs.
  - **Mauvais** :
    - Certains peuvent ne pas le préférer, bien qu'aucun inconvénient significatif ne soit noté.

## Ajouter des data-testid à Vos Composants

Nous vous suggérons d'assigner des identifiants de test uniques aux éléments avec lesquels vous avez l'intention d'interagir dans vos tests. Compter sur ces identifiants est plus fiable que d'utiliser d'autres attributs, comme le texte brut, qui peuvent changer fréquemment et varier selon les localités. De plus, utiliser des identifiants de test uniques dans toute votre application simplifie le processus d'identification et d'interaction avec des éléments spécifiques, améliore la lisibilité du code et facilite la navigation et la maintenance de votre base de code.

Les exemples suivants devraient couvrir la plupart (sinon la totalité) des scénarios possibles et suivre toutes les meilleures pratiques.

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

Dans l'exemple ci-dessus, vous pouvez clairement voir tous les data-testid possibles et comment ils se comportent. Voici une liste de data-testid uniques, en considérant l'utilisation du composant MainComponent mentionné ci-dessous:

```
<MainComponent
  title="Component title"
  description="nice description"
  nameList={["ana", "bob", "kostantine"]}
/>
```

Voici la liste des data-testid générés :

<img src="images/rendered.png" alt="composants rendus avec les data-testid affichés">

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

## Ajouter des data-testid sur plusieurs blocs

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

Voici la liste des data-testid générés :

```
MainComponent.section.heading
MainComponent.section.description
MainComponent.block.nameList.item.0
MainComponent.block.nameList.item.1
MainComponent.block.nameList.item.2
```
