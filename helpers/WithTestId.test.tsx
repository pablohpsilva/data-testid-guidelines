import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import withTestId from ".";

const MockComponent = ({ text, testId }: { text: string; testId?: string }) => (
  <div data-testid={testId}>{text}</div>
);
const MockComponentWithTestId = withTestId<{ text: string; testId?: string }>(
  MockComponent
);

describe("withTestId", () => {
  it("It tests the a custom testId", () => {
    render(
      <MockComponentWithTestId text="Hello, World!" testId="mock-component" />
    );
    const element = screen.getByTestId("mock-component.MockComponent");
    expect(element).toBeTruthy();
    expect(element.textContent).toBe("Hello, World!");
  });

  it("It tests the default testId based on the Wrapped component name", () => {
    render(<MockComponentWithTestId text="Hello, World!" />);
    const element = screen.getByTestId("MockComponent");
    expect(element).toBeTruthy();
    expect(element.textContent).toBe("Hello, World!");
  });
});
