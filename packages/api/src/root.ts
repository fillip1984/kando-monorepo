import { authRouter } from "./router/auth"
import { emailRouter } from "./router/email"
import { settingsRouter } from "./router/settings"
import { tagRouter } from "./router/tag"
import { taskRouter } from "./router/task"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  email: emailRouter,
  settings: settingsRouter,
  tags: tagRouter,
  tasks: taskRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
