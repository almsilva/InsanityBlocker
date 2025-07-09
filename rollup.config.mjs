import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import metadata from "rollup-plugin-userscript-metadata";
import terser from "@rollup/plugin-terser";

export default {
  input: "main.user.js",
  output: {
    file: "dist/insanity_blocker.user.js",
    format: "iife",
    name: "InsanityBlocker",
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      presets: [["@babel/preset-env", { targets: "defaults" }]],
    }),
    metadata({
      metadata: "metadata.json",
    }),
  ],
};
