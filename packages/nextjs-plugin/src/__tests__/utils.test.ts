import { describe, it, expect } from "vitest";
import {
  mergeOptions,
  shouldSkipElement,
  generateTestId,
  getComponentNameFromFunction,
  detectLoopContext,
  isInsideLoop,
} from "../utils";
import { TestIdContext, DEFAULT_OPTIONS } from "../types";

describe("Utils", () => {
  describe("mergeOptions", () => {
    it("should merge options with defaults", () => {
      const options = mergeOptions({ separator: "-", enabled: false });

      expect(options).toEqual({
        ...DEFAULT_OPTIONS,
        separator: "-",
        enabled: false,
      });
    });

    it("should return defaults when no options provided", () => {
      const options = mergeOptions();

      expect(options).toEqual(DEFAULT_OPTIONS);
    });
  });

  describe("shouldSkipElement", () => {
    it("should skip elements in skipElements array", () => {
      const options = mergeOptions({ skipElements: ["img", "br"] });

      expect(shouldSkipElement("img", options)).toBe(true);
      expect(shouldSkipElement("br", options)).toBe(true);
      expect(shouldSkipElement("div", options)).toBe(false);
    });

    it("should skip non-interactive elements when onlyInteractive is true", () => {
      const options = mergeOptions({ onlyInteractive: true });

      expect(shouldSkipElement("div", options)).toBe(true);
      expect(shouldSkipElement("span", options)).toBe(true);
      expect(shouldSkipElement("button", options)).toBe(false);
      expect(shouldSkipElement("input", options)).toBe(false);
      expect(shouldSkipElement("a", options)).toBe(false);
    });
  });

  describe("generateTestId", () => {
    it("should generate basic test ID", () => {
      const context: TestIdContext = {
        componentName: "Button",
        hierarchy: [],
        loopIndices: new Map(),
        elementCounts: new Map(),
      };

      const testId = generateTestId("button", context, DEFAULT_OPTIONS);

      expect(testId).toBe("Button.button");
    });

    it("should generate test ID without element when includeElement is false", () => {
      const context: TestIdContext = {
        componentName: "Button",
        hierarchy: [],
        loopIndices: new Map(),
        elementCounts: new Map(),
      };
      const options = mergeOptions({ includeElement: false });

      const testId = generateTestId("button", context, options);

      expect(testId).toBe("Button");
    });

    it("should generate test ID with hierarchy", () => {
      const context: TestIdContext = {
        componentName: "Navigation",
        hierarchy: ["tabs", "item", "0"],
        loopIndices: new Map(),
        elementCounts: new Map(),
      };

      const testId = generateTestId("button", context, DEFAULT_OPTIONS);

      expect(testId).toBe("Navigation.tabs.item.0.button");
    });

    it("should use custom separator", () => {
      const context: TestIdContext = {
        componentName: "Button",
        hierarchy: ["group"],
        loopIndices: new Map(),
        elementCounts: new Map(),
      };
      const options = mergeOptions({ separator: "-" });

      const testId = generateTestId("button", context, options);

      expect(testId).toBe("Button-group-button");
    });
  });

  describe("getComponentNameFromFunction", () => {
    it("should extract component name from function declaration", () => {
      const code = `
export function MyComponent() {
  return <div>Hello</div>;
}`;

      const name = getComponentNameFromFunction(code, 30);

      expect(name).toBe("MyComponent");
    });

    it("should extract component name from const declaration", () => {
      const code = `
const UserCard = () => {
  return <div>User</div>;
}`;

      const name = getComponentNameFromFunction(code, 20);

      expect(name).toBe("UserCard");
    });

    it("should return null when no function found", () => {
      const code = `
const notAFunction = { name: 'test' };
`;

      const name = getComponentNameFromFunction(code, 20);

      expect(name).toBe(null);
    });
  });

  describe("detectLoopContext", () => {
    it("should detect map loops", () => {
      const code = `
const items = ['a', 'b'];
return items.map((item, index) => <div key={index}>{item}</div>);
`;

      const loopVar = detectLoopContext(code, 80);

      expect(loopVar).toBe("items");
    });

    it("should detect forEach loops", () => {
      const code = `
const todos = [];
todos.forEach((todo, index) => {
  return <li key={index}>{todo}</li>;
});
`;

      const loopVar = detectLoopContext(code, 80);

      expect(loopVar).toBe("todos");
    });

    it("should detect for...of loops", () => {
      const code = `
for (const item of items) {
  return <div>{item}</div>;
}
`;

      const loopVar = detectLoopContext(code, 50);

      expect(loopVar).toBe("items");
    });

    it("should return null when no loop detected", () => {
      const code = `
return <div>No loop here</div>;
`;

      const loopVar = detectLoopContext(code, 20);

      expect(loopVar).toBe(null);
    });
  });

  describe("isInsideLoop", () => {
    it("should return true when inside a loop", () => {
      const code = `
items.map((item, index) => <div key={index}>{item}</div>);
`;

      const inside = isInsideLoop(code, 40);

      expect(inside).toBe(true);
    });

    it("should return false when not inside a loop", () => {
      const code = `
return <div>Not in a loop</div>;
`;

      const inside = isInsideLoop(code, 20);

      expect(inside).toBe(false);
    });
  });
});
