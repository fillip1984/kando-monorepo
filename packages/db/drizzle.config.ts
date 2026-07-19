import type { Config } from "drizzle-kit"

import { env } from "./env"

const nonPoolingUrl = env.DATABASE_URL.replace(":6543", ":5432")

export default {
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: nonPoolingUrl,
    ssl: env.NODE_ENV === "production" ? "require" : "prefer",
  },
  schemaFilter: [env.DATABASE_SCHEMA],
} satisfies Config
