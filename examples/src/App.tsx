/**
 * Example implementations showing how to use the simplified data-testid library
 */

import { FC, HTMLAttributes } from "react";
import { PropsWithTestId, withTestId } from "../../src";

const Button = withTestId(function Button({
  testId,
  children,
  ...props
}: PropsWithTestId<
  HTMLAttributes<HTMLButtonElement> & {
    testId?: string;
  }
>) {
  return (
    <button data-testid={testId} {...props}>
      {children}
    </button>
  );
});

const EnhancedButton = withTestId(function EnhancedButton({
  testId,
  children,
  ...props
}: PropsWithTestId<
  HTMLAttributes<HTMLButtonElement> & {
    testId?: string;
  }
>) {
  return (
    <button data-testid={testId} {...props}>
      {children}
    </button>
  );
});

const Wrapper = withTestId(function Wrapper({
  testId,
  ...props
}: PropsWithTestId<
  HTMLAttributes<HTMLDivElement> & {
    testId?: string;
  }
>) {
  return (
    <div data-testid={testId} {...props}>
      {props.children}
    </div>
  );
});

const NestedWrapper = withTestId(function NestedWrapper({
  testId,
  ...props
}: PropsWithTestId<
  HTMLAttributes<HTMLDivElement> & {
    testId?: string;
  }
>) {
  return (
    <>
      <Wrapper testId={testId} {...props}>
        <Button testId={testId} onClick={() => alert("Manual button clicked!")}>
          Manual TestId Button
        </Button>
        <EnhancedButton
          testId={testId}
          onClick={() => alert("Enhanced button clicked!")}
        >
          Enhanced Button
        </EnhancedButton>
      </Wrapper>
      <pre>
        {`<div data-testid="Wrapper2" class="example-section">
  <h2>Example 2: Nested Button Components</h2>
  <div data-testid="NestedWrapper2.Wrapper2">
    <button data-testid="NestedWrapper2.Button2">Manual TestId Button</button>
    <button data-testid="NestedWrapper2.EnhancedButton2">Enhanced Button</button>
  </div>
</div>`}
      </pre>
    </>
  );
});

// Main App Component demonstrating all examples
export const ExampleUsage: FC = () => {
  return (
    <Wrapper>
      <h1>Data TestId Guidelines - Simplified Examples</h1>

      <Wrapper className="example-section">
        <h2>Example 1: Basic Button Components</h2>
        <span>
          In this example, I'm giving a testId to each element. The side-effect
          of this are many elements with the same testId, but see how the
          test-ids are generated always using the data-testid AND the component
          element (if present)
        </span>
        <br />
        <br />
        <Wrapper style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
          <Button
            testId="manual-button"
            onClick={() => alert("Manual button clicked!")}
          >
            Manual TestId Button
          </Button>
          <EnhancedButton
            testId="enhanced-button"
            onClick={() => alert("Enhanced button clicked!")}
          >
            Enhanced Button
          </EnhancedButton>
          <button onClick={() => alert("Regular button clicked!")}>
            regular button
          </button>
        </Wrapper>

        <pre>
          {`<div data-testid="Wrapper2" class="example-section">
  <h2>Example 1: Basic Button Components</h2>
  <div data-testid="Wrapper2" style="display: flex; gap: 10px; margin: 10px 0px;">
  <button data-testid="manual-button.Button2">Manual TestId Button</button>
  <button data-testid="enhanced-button.EnhancedButton2">Enhanced Button</button>
  <button>regular button</button>
  </div>
</div>`}
        </pre>
      </Wrapper>

      <Wrapper className="example-section">
        <h2>Example 2: Nested Button Components</h2>
        <span>
          In this example, we have a nested wrapper component that contains a
          button component. I'm passing the testId from the NestedWrapper to the
          children components. This way, the data-testid will be rendered in a
          way you can see exactly where it is coming from.
        </span>
        <br />
        <br />
        <NestedWrapper>
          <Button
            testId="manual-button"
            onClick={() => alert("Manual button clicked!")}
          >
            Manual TestId Button
          </Button>
        </NestedWrapper>
      </Wrapper>

      <Wrapper className="example-section">
        <h2>Example 3: Loops</h2>
        <span>
          In this example, we have a loop that creates 5 buttons. I'm passing
          the testId from the Wrapper to the children components. This way, it
          is easy to test each button individually.
        </span>
        <br />
        <br />
        <Wrapper>
          {Array.from({ length: 5 }, (_, index) => (
            <Button
              key={`${_}${index}`}
              testId={`Wrapper.btnList.item.${index}`}
              onClick={() => alert(`Manual button ${index} clicked!`)}
            >
              btn {index}
            </Button>
          ))}
        </Wrapper>
        <pre>
          {`<div data-testid="Wrapper2">
  <button data-testid="Wrapper.btnList.item.0.Button2">btn 0</button>
  <button data-testid="Wrapper.btnList.item.1.Button2">btn 1</button>
  <button data-testid="Wrapper.btnList.item.2.Button2">btn 2</button>
  <button data-testid="Wrapper.btnList.item.3.Button2">btn 3</button>
  <button data-testid="Wrapper.btnList.item.4.Button2">btn 4</button>
</div>`}
        </pre>
      </Wrapper>
    </Wrapper>
  );
};
