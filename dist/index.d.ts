import { type FC, type ComponentType } from "react";
export interface WithTestId {
    testId?: string;
}
export type PropsWithTestId<T = Record<string, unknown>> = T & WithTestId;
export declare function testIdAttr(testId: string): {
    "data-testid": string;
};
export declare function withTestId<T extends Record<string, unknown>>(WrappedComponent: ComponentType<PropsWithTestId<T>>): FC<PropsWithTestId<T>>;
export default withTestId;
//# sourceMappingURL=index.d.ts.map