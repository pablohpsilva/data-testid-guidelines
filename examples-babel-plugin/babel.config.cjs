module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets:
          process.env.NODE_ENV === "test"
            ? { node: "current" }
            : { browsers: "> 1%" },
        modules: process.env.NODE_ENV === "test" ? "auto" : false,
      },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    // Add our auto-testid plugin - only in test and development environments
    ...(process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "development"
      ? [
          [
            require.resolve("../plugins/babel-plugin-auto-testid.cjs"),
            {
              // Configuration options
              separator: ".",
              includeElement: true,
              useHierarchy: true,
              skipElements: ["br", "hr", "img", "svg"],
              onlyInteractive: false, // Set to true to only add to buttons, inputs, etc.
            },
          ],
        ]
      : []),
  ],
};
