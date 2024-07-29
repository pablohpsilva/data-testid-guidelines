# Diretrizes para Definir `data-testid` em Aplicações React

* [EN](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README.md)
* [ES](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-ES.md)
* [FR](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-FR.md)
* [JP](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-JP.md)
* [LU](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-LG.md)
* [PT-BR](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-PTBR.md)
* [RU](https://github.com/pablohpsilva/data-testid-guidelines/blob/main/README-RU.md)

Criar atributos `data-testid` previsíveis, únicos e confiáveis é essencial para garantir testes robustos e sustentáveis. Este guia fornece as melhores práticas, exemplos e padrões comuns para definir atributos `data-testid` em suas aplicações React (ou basicamente em qualquer aplicação).

## Por Que Usar `data-testid`?

- **Consistência**: Proporciona uma maneira consistente de identificar elementos em diferentes suítes de teste.
- **Estabilidade**: Menos propenso a mudanças em comparação com nomes de classes ou conteúdo de texto, tornando os testes mais confiáveis.
- **Clareza**: Melhora a legibilidade dos testes ao indicar claramente quais elementos estão sendo direcionados.

## Melhores Práticas

- **Use Nomes Semânticos**: Utilize nomes claros e descritivos que reflitam o propósito do elemento. Evite nomes genéricos.
- **Aplique Apenas a Elementos Chave**: Aplique `data-testid` a elementos interativos chave ou àqueles que requerem interação direta nos testes.
- **Evite Usar para Estilização**: O `data-testid` deve ser usado exclusivamente para fins de teste e não para estilização ou outra lógica.
- **Mantenha IDs Únicos**: Garanta que os valores de `data-testid` sejam únicos no escopo de sua aplicação para evitar conflitos.

## Diretrizes para Definir `data-testid`

- **Use Pascal Case** (ex.: `MyComponent`) para componentes e camel case (ex.: `section`) para elementos.
  - **Bom**:
    - Indica claramente a origem e o propósito do elemento.
    - Adiciona especificidade, tornando-o único e previsível.
    - Reduz a probabilidade de duplicação.
    - Fornece uma hierarquia clara para depuração.
      - Ex.: `MyComponent.NameList.NameListItem.0.label` mostra a origem e a hierarquia do elemento.
    - Ignorar esta diretriz pode levar à perda dos benefícios acima, dependendo da maturidade da sua equipe na criação e manutenção desses `data-testid`s.
  - **Ruim**:
    - Os nomes podem se tornar longos quanto mais fundo você for na árvore DOM.
    - Requer mais digitação ao escrever testes.
- **Crie um Tipo/Interface Simples** que possa ser expandido confiando em uma propriedade chamada `testId` para seus componentes.
  - **Bom**:
    - Evita repetição ao ter uma interface reutilizável.
    - Protege automaticamente contra futuras mudanças.
    - Identifica claramente componentes que suportam ou precisam de um `data-testid`.
  - **Ruim**:
    - Em projetos em andamento, você precisará criar e aplicar esse tipo em muitos arquivos.
- **Use Propriedade Específica de Componente `testId`**:
  - **Bom**:
    - Garante a exclusividade combinando os nomes dos componentes pai e filho.
    - Simplifica a identificação e interação com os elementos.
  - **Ruim**:
    - Pode resultar em valores longos de `data-testid`, o que pode ser incômodo.
- **Use `.` (Ponto) como Separador**:
  - **Bom**:
    - Proporciona uma cadeia clara de informações.
    - Visualmente mais atraente do que outros separadores.
  - **Ruim**:
    - Alguns podem não preferir, embora não haja desvantagens significativas observadas.

## Adicionando `data-testid` aos Seus Componentes

Sugerimos atribuir IDs de teste únicos aos elementos com os quais você pretende interagir em seus testes. Confiar nesses IDs é mais confiável do que usar outros atributos, como texto bruto, que podem mudar frequentemente e variar por localidade. Além disso, usar IDs de teste únicos em toda a sua aplicação simplifica o processo de identificar e interagir com elementos específicos, melhorando a legibilidade do código e facilitando a navegação e manutenção do código.

Os exemplos a seguir devem cobrir a maioria (se não todos) dos possíveis cenários e seguir todas as melhores práticas.

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
        Exemplo de um loop, sem componentes adicionais
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
        Exemplo de um loop, COM componentes adicionais
      </p>
      <NameList items={nameList} testId={componentName} />
    </>
  );
};

// Este componente NÃO suporta ser autônomo
const Heading: FC<PropsWithChildren<PropWithTestId>> = ({
  children,
  testId
}) => {
  return <h1 data-testid={`${testId}.Heading`}>{children}</h1>;
};

// Este componente suporta ser autônomo
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

// Este componente NÃO suporta ser autônomo
const NameListItem: FC<PropsWithChildren<
  { index: number } & PropWithTestId
>> = ({ children, index, testId }) => {
  const componentName = `${testId}.${NameListItem?.name}`;
  return <span data-testid={`${componentName}.${index}`}>{children}</span>;
};
```

No exemplo acima, você pode ver claramente todos os possíveis data-testids e como eles se comportam. Aqui está uma lista de data-testids únicos, considerando o uso do componente MainComponent mencionado abaixo:

```
<MainComponent
  title="Título do Componente"
  description="descrição bacana"
  nameList={["ana", "bob", "kostantine"]}
/>

```

Aqui está a lista de data-testids gerados:

<img src="images/rendered.png" alt="componentes renderizados com `data-testids` sendo exibidos">

```
MainComponent.heading
MainComponent.description

// loop regular
MainComponent.nameList.item.0
MainComponent.nameList.item.1
MainComponent.nameList.item.2

// loop baseado em componentes
MainComponent.NameList.NameListItem.0
MainComponent.NameList.NameListItem.1
MainComponent.NameList.NameListItem.2

```

## Adicionando data-testid em múltiplos blocos

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

Aqui está a lista de data-testids gerados:
```
MainComponent.section.heading
MainComponent.section.description
MainComponent.block.nameList.item.0
MainComponent.block.nameList.item.1
MainComponent.block.nameList.item.2
```