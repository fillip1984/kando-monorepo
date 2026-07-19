import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@kando/eslint-config/base";

export default defineConfig(
  {
    ignores: ["script/**"],
  },
  baseConfig,
  restrictEnvAccess,
);
