import { defineConfig } from "eslint/config";

import { baseConfig } from "@kando/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
