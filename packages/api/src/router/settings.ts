import { db } from "@kando/db/client"
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
  // importData: protectedProcedure
  //   .input(
  //     z.object({
  //       tasks: z.array(
  //         z.object({
  //           id: z.string(),
  //           name: z.string(),
  //           description: z.string(),
  //         })
  //       ),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     for (const area of input.areas) {
  //       const existingArea = await ctx.db.area.findUnique({
  //         where: { id: area.id, userId: ctx.session.user.id },
  //       })
  //       if (!existingArea) {
  //         await ctx.db.area.create({
  //           data: {
  //             id: area.id,
  //             name: area.name,
  //             description: area.description,
  //             userId: ctx.session.user.id,
  //           },
  //         })
  //       }
  //     }

  //     for (const measurable of input.measurables) {
  //       const existingMeasurable = await ctx.db.measurable.findUnique({
  //         where: { id: measurable.id, userId: ctx.session.user.id },
  //       })
  //       if (existingMeasurable) continue

  //       await ctx.db.measurable.create({
  //         data: {
  //           setDate: measurable.setDate,
  //           name: measurable.name,
  //           description: measurable.description,
  //           areaId: measurable.areaId,
  //           suggestedDay: measurable.suggestedDay,
  //           suggestedDayTime: measurable.suggestedDayTime,
  //           type: measurable.type,
  //           dueDate: measurable.dueDate,
  //           interval: measurable.interval,
  //           userId: ctx.session.user.id,
  //         },
  //       })
  //     }
  //   }),
})
