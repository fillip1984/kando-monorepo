import { sql } from "@kando/db"
import { db } from "@kando/db/client"

export async function GET() {
  try {
    await db.execute(sql`select 1`)
    return Response.json({ status: "ok", timestamp: new Date().toISOString() })
  } catch (error) {
    console.error("[health] database check failed", error)
    return Response.json(
      {
        status: "error",
        message: "db check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
