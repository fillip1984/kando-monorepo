import { z } from "zod"

import { and, eq } from "@kando/db"
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
  readAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.tags.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { name: "asc" },
    })
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db
        .update(tags)
        .set({
          name: input.name,
          description: input.description,
          color: input.color,
        })
        .where(and(eq(tags.id, input.id), eq(tags.userId, ctx.session.user.id)))
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db
        .delete(tags)
        .where(and(eq(tags.id, input.id), eq(tags.userId, ctx.session.user.id)))
    }),
})
