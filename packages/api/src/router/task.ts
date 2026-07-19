import { z } from "zod"

import { db } from "@kando/db/client"
import { TaskPriorityEnumValues, TaskStatusEnumValues } from "@kando/db/enums"
import { tasks } from "@kando/db/schema"
import { createTRPCRouter, protectedProcedure } from "../trpc"
export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        dueDate: z.string().optional().nullable(),
        status: z.enum(TaskStatusEnumValues),
        priority: z.enum(TaskPriorityEnumValues).optional().nullable(),
        position: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db.insert(tasks).values({
        ...input,
        userId: ctx.session.user.id,
      })
    }),
})
