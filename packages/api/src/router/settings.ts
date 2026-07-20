import { db } from "@kando/db/client"
import { TaskPriorityEnumValues, TaskStatusEnumValues } from "@kando/db/enums"
import {
  checklistItems,
  comments,
  tags,
  tasks,
  taskTags,
} from "@kando/db/schema"
import z from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const settingsRouter = createTRPCRouter({
  exportData: protectedProcedure.mutation(async ({ ctx }) => {
    const tasks = await db.query.tasks.findMany({
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

    return {
      tasks,
    }
  }),
  importData: protectedProcedure
    .input(
      z.object({
        tasks: z.array(
          z.object({
            title: z.string(),
            description: z.string().nullable(),
            dueDate: z.string().nullable(),
            status: z.enum(TaskStatusEnumValues),
            priority: z.enum(TaskPriorityEnumValues).nullable(),
            position: z.number(),
            emailSubjectLine: z.string().nullable(),
            checklistItems: z.array(
              z.object({
                content: z.string(),
                complete: z.boolean(),
                position: z.number(),
                taskId: z.string(),
              })
            ),
            comments: z.array(
              z.object({
                content: z.string(),
                taskId: z.string(),
              })
            ),
            taskTags: z.array(
              z.object({
                taskId: z.string(),
                tagId: z.string(),
                tag: z.object({
                  name: z.string(),
                  description: z.string(),
                  color: z.string(),
                }),
              })
            ),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // upsert tags
      const importTags = input.tasks.flatMap((task) =>
        task.taskTags.map((taskTag) => taskTag.tag)
      )
      for (const tag of importTags) {
        await ctx.db.transaction(async (tx) => {
          await tx
            .insert(tags)
            .values({
              name: tag.name,
              description: tag.description,
              color: tag.color,
              userId: ctx.session.user.id,
            })
            .onConflictDoNothing()
        })
      }
      const existingTags = await db.query.tags.findMany({
        where: { userId: ctx.session.user.id },
      })

      // insert tasks, checklist items, comments, and task tags
      for (const task of input.tasks) {
        await ctx.db.transaction(async (tx) => {
          const insertedTask = await tx
            .insert(tasks)
            .values({
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate,
              position: task.position,
              emailSubjectLine: task.emailSubjectLine,
              userId: ctx.session.user.id,
            })
            .returning({ id: tasks.id })
          if (insertedTask.length === 0) {
            throw new Error("Failed to insert task")
          }
          const insertedTaskId = insertedTask[0]!.id
          // insert checklist items
          for (const checklistItem of task.checklistItems) {
            await tx.insert(checklistItems).values({
              content: checklistItem.content,
              complete: checklistItem.complete,
              position: checklistItem.position,
              taskId: insertedTaskId,
              userId: ctx.session.user.id,
            })
          }
          // insert comments
          for (const comment of task.comments) {
            await tx.insert(comments).values({
              content: comment.content,
              taskId: insertedTaskId,
              userId: ctx.session.user.id,
            })
          }
          // insert task tags
          const tagsToReconnect = task.taskTags.flatMap((taskTag) => {
            return { name: taskTag.tag.name }
          })
          for (const tag of tagsToReconnect) {
            console.log({ existingTags })
            const tagId = existingTags.find(
              (existingTag) => existingTag.name === tag.name
            )?.id
            if (!tagId) {
              throw new Error(`Tag with name ${tag.name} not found`)
            }
            await tx.insert(taskTags).values({
              taskId: insertedTaskId,
              tagId,
              userId: ctx.session.user.id,
            })
          }
        })
      }
    }),
})
