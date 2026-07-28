import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { env } from "../env"
import * as schema from "./schema/app-schema"
import { relations } from "./schema/relations"

const client = postgres(env.DATABASE_URL, {
  prepare: false,
  ssl: {
    // necessary to ignore self-signed certificates or certs not trusted
    rejectUnauthorized: false,
  },
})

export const db = drizzle({
  client: client,
  relations: {
    ...schema,
    ...relations,
  },
  logger: env.NODE_ENV !== "production",
})
