import React, { type FC, type ComponentType, useMemo } from "react";

// Types
export interface WithTestId {
  testId?: string;
}

export type PropsWithTestId<T = Record<string, unknown>> = T & WithTestId;

// Utility function for creating data-testid attributes
export function testIdAttr(testId: string): { "data-testid": string } {
  return { "data-testid": testId };
}

// Main HOC
export function withTestId<T extends Record<string, unknown>>(
  WrappedComponent: ComponentType<PropsWithTestId<T>>
): FC<PropsWithTestId<T>> {
  const WithTestIdWrappedComponent: FC<PropsWithTestId<T>> = (props) => {
    const componentName = useMemo(() => {
      const previousDataTestId = props?.testId ?? props?.["data-testid"];
      const componentName = previousDataTestId
        ? `${previousDataTestId}.${WrappedComponent.name || "Component"}`
        : WrappedComponent.name || "Component";

      return componentName;
    }, [props?.testId, WrappedComponent?.name]);

    return <WrappedComponent {...(props as T)} testId={componentName} />;
  };

  return WithTestIdWrappedComponent;
}

export default withTestId;
