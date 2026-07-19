import { z } from "zod"

import { db } from "@kando/db/client"
import { tags } from "@kando/db/schema"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db.insert(tags).values({
        ...input,
        userId: ctx.session.user.id,
      })
    }),
})
