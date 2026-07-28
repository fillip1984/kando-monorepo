import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { env } from "../env"
import * as schema from "./schema/app-schema"
import { relations } from "./schema/relations"

const client = postgres(env.DATABASE_URL, {
  prepare: false,
  // ssl: env.NODE_ENV === "production",
})

export const db = drizzle({
  client: client,
  relations: {
    ...schema,
    ...relations,
  },
  logger: env.NODE_ENV !== "production",
})
