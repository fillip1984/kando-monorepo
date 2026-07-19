import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@kando/eslint-config/base";
import { reactConfig } from "@kando/eslint-config/react";

export default defineConfig(
  {
    ignores: [".nitro/**", ".output/**", ".tanstack/**"],
  },
  baseConfig,
  reactConfig,
  restrictEnvAccess,
);
