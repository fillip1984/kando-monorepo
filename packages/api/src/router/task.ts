import { z } from "zod"

import { and, eq } from "@kando/db"
import { db } from "@kando/db/client"
import { TaskPriorityEnumValues, TaskStatusEnumValues } from "@kando/db/enums"
import { checklistItems, comments, tasks, taskTags } from "@kando/db/schema"
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
        emailSubjectLine: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.insert(tasks).values({
        ...input,
        userId: ctx.session.user.id,
      })
    }),
  readAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.tasks.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: {
        position: "asc",
      },
      with: {
        checklistItems: {
          orderBy: {
            position: "asc",
          },
        },
        comments: true,
        taskTags: {
          with: {
            tag: true,
          },
        },
      },
    })
  }),
  readById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await db.query.tasks.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        with: {
          checklistItems: {
            orderBy: {
              position: "asc",
            },
          },
          comments: true,
          taskTags: {
            with: {
              tag: true,
            },
          },
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        dueDate: z.string().optional().nullable(),
        status: z.enum(TaskStatusEnumValues).optional(),
        priority: z.enum(TaskPriorityEnumValues).optional().nullable(),
        position: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // const { id, ...data } = input
      await db
        .update(tasks)
        .set({ ...input })
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, ctx.session.user.id))
        )
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(tasks)
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, ctx.session.user.id))
        )
    }),
  reorderTasks: protectedProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            taskId: z.string(),
            title: z.string().min(1),
            status: z.enum(TaskStatusEnumValues),
            position: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatePromises = input.updates.map(
        ({ taskId, title, status, position }) =>
          db
            .update(tasks)
            .set({ title, status, position })
            .where(
              and(eq(tasks.id, taskId), eq(tasks.userId, ctx.session.user.id))
            )
      )
      await Promise.all(updatePromises)
    }),
  createChecklistItem: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        position: z.number(),
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.insert(checklistItems).values({
        ...input,
        userId: ctx.session.user.id,
      })
    }),
  updateChecklistItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1).optional(),
        position: z.number().optional(),
        complete: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(checklistItems)
        .set({ ...input })
        .where(
          and(
            eq(checklistItems.id, input.id),
            eq(checklistItems.userId, ctx.session.user.id)
          )
        )
    }),
  deleteChecklistItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(checklistItems)
        .where(
          and(
            eq(checklistItems.id, input.id),
            eq(checklistItems.userId, ctx.session.user.id)
          )
        )
    }),
  reorderChecklistItems: protectedProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            checklistItemId: z.string(),
            position: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatePromises = input.updates.map(
        ({ checklistItemId, position }) =>
          db
            .update(checklistItems)
            .set({ position })
            .where(
              and(
                eq(checklistItems.id, checklistItemId),
                eq(checklistItems.userId, ctx.session.user.id)
              )
            )
      )
      await Promise.all(updatePromises)
    }),
  createComment: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.insert(comments).values({
        ...input,
        userId: ctx.session.user.id,
      })
    }),
  updateComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(comments)
        .set({ ...input })
        .where(
          and(
            eq(comments.id, input.id),
            eq(comments.userId, ctx.session.user.id)
          )
        )
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(comments)
        .where(
          and(
            eq(comments.id, input.id),
            eq(comments.userId, ctx.session.user.id)
          )
        )
    }),
  addTagToTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        tagId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.insert(taskTags).values({
        taskId: input.taskId,
        tagId: input.tagId,
        userId: ctx.session.user.id,
      })
    }),
  removeTagFromTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        tagId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(taskTags)
        .where(
          and(
            eq(taskTags.taskId, input.taskId),
            eq(taskTags.tagId, input.tagId),
            eq(taskTags.userId, ctx.session.user.id)
          )
        )
    }),
})
