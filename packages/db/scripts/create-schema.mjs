import postgres from "postgres"

const databaseUrl = process.env.DATABASE_URL
const schemaName = process.env.DATABASE_SCHEMA

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required")
}

if (!schemaName) {
  throw new Error("DATABASE_SCHEMA is required")
}

const nonPoolingUrl = databaseUrl.replace(":6543", ":5432")
const client = postgres(nonPoolingUrl, {
  prepare: false,
  ssl: "require",
})

await client.unsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
await client.end()
