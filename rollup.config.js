const resolve = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");
const dts = require("rollup-plugin-dts");

const packageJson = require("./package.json");

module.exports = [
  {
    input: "src/index.tsx",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      resolve.default(),
      typescript.default({
        tsconfig: "./tsconfig.json",
        exclude: [
          "**/*.test.*",
          "**/*.stories.*",
          "examples/**/*",
          "examples-babel-plugin/**/*",
        ],
        jsx: "react",
        jsxFactory: "React.createElement",
        noEmitOnError: false,
        declaration: true,
        declarationDir: "dist",
      }),
    ],
    external: ["react", "react-dom", "react/jsx-runtime"],
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts.default()],
    external: [/\.css$/, "react", "react-dom"],
  },
];
