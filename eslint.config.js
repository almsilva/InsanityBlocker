import { defineConfig } from "eslint/config";
import pluginJest from "eslint-plugin-jest";

export default defineConfig([
  {
    ignores: [
      "eslint.config.js",
      "jest.config.js",
      "jest.setup.js",
      "./coverage/lcov-report/*.js",
    ],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
  },
]);
