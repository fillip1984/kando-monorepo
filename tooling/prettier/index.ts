import type { PluginOptions } from "prettier-plugin-tailwindcss";
import { type Config } from "prettier";

const config: Config & PluginOptions = {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,

  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],

  tailwindFunctions: ["cn", "cva"],
};

export default config;
