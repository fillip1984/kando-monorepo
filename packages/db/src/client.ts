import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { env } from "../env"
import { authRelations } from "./schema"
import * as schema from "./schema/app-schema"
import { relations } from "./schema/relations"

const client = postgres(env.DATABASE_URL, {
  prepare: false,
  ...(env.DATABASE_URL.includes("localhost")
    ? {
        // ssl doesn't work locally
      }
    : {
        ssl: {
          // necessary to ignore self-signed certificates or certs not trusted
          rejectUnauthorized: false,
        },
      }),
})

export const db = drizzle({
  client: client,
  relations: {
    ...schema,
    ...relations,
    ...authRelations,
  },
  logger: env.DATABASE_URL.includes("localhost") ? false : true,
})
