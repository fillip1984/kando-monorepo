import { authRouter } from "./router/auth"
import { tagRouter } from "./router/tag"
import { taskRouter } from "./router/task"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  tasks: taskRouter,
  tags: tagRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
