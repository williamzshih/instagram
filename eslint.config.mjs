import { FlatCompat } from "@eslint/eslintrc";
import perfectionist from "eslint-plugin-perfectionist";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  }),
  perfectionist.configs["recommended-natural"],
];

export default eslintConfig;
