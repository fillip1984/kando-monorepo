import { defineConfig } from "eslint/config";

import { baseConfig } from "@kando/eslint-config/base";
import { reactConfig } from "@kando/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
