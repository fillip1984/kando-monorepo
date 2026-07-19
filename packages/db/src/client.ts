import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { env } from "../env"
import * as schema from "./schema/app-schema"
import * as relations from "./schema/relations"

const client = postgres(env.DATABASE_URL, {
  prepare: false,
})

export const db = drizzle({
  client: client,
  ...schema,
  ...relations,
  logger: env.NODE_ENV !== "production",
})
