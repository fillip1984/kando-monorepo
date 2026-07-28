import type { Config } from "drizzle-kit"

import { env } from "./env"

const nonPoolingUrl = env.DATABASE_URL.replace(":6543", ":5432")
const databaseUrl = new URL(nonPoolingUrl)

export default {
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: databaseUrl.hostname,
    port: databaseUrl.port ? Number(databaseUrl.port) : 5432,
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.replace(/^\//, ""),
    ssl: env.DATABASE_SSL === "require" ? "require" : "prefer",
  },
  schemaFilter: [env.DATABASE_SCHEMA],
} satisfies Config
