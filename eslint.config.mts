import { FlatCompat } from "@eslint/eslintrc";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}, ...compat.config({
  extends: ["next/core-web-vitals", "next/typescript", "prettier"],
}), ...defineConfig({
  extends: [perfectionist.configs["recommended-natural"]],
  rules: {
    "perfectionist/sort-imports": [
      "error",
      {
        newlinesBetween: 0,
      },
    ],
  },
})];

export default eslintConfig;
