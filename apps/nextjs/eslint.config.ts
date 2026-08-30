import { defineConfig } from "eslint/config"

import { baseConfig, restrictEnvAccess } from "@kando/eslint-config/base"
import { nextjsConfig } from "@kando/eslint-config/nextjs"
import { reactConfig } from "@kando/eslint-config/react"

export default defineConfig(
  {
    ignores: [".next/**", "src/lib/utils.ts", "src/components/ui/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess
)
