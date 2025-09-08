'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

// Utility function for creating data-testid attributes
function testIdAttr(testId) {
    return { "data-testid": testId };
}
// Main HOC
function withTestId(WrappedComponent) {
    const WithTestIdWrappedComponent = (props) => {
        const componentName = React.useMemo(() => {
            const previousDataTestId = props?.testId ?? props?.["data-testid"];
            const componentName = previousDataTestId
                ? `${previousDataTestId}.${WrappedComponent.name || "Component"}`
                : WrappedComponent.name || "Component";
            return componentName;
        }, [props?.testId, WrappedComponent?.name]);
        return React.createElement(WrappedComponent, { ...props, testId: componentName });
    };
    return WithTestIdWrappedComponent;
}

exports.default = withTestId;
exports.testIdAttr = testIdAttr;
exports.withTestId = withTestId;
//# sourceMappingURL=index.js.map
