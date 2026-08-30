import { createTRPCRouter, publicProcedure } from "../trpc"

export const healthRouter = createTRPCRouter({
  healthCheck: publicProcedure.query(() => {
    return { status: "ok" }
  }),
})
