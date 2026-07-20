import { authRouter } from "./router/auth"
import { emailRouter } from "./router/email"
import { tagRouter } from "./router/tag"
import { taskRouter } from "./router/task"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  email: emailRouter,
  tags: tagRouter,
  tasks: taskRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
