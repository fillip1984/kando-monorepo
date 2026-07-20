import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

import type { AppRouter } from "./root"

/**
 * Inference helpers for input types
 * @example
 * type TaskByIdInput = RouterInputs['task']['byId']
 *      ^? { id: number }
 */
type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example
 * type AllTasksOutput = RouterOutputs['task']['all']
 *      ^? Task[]
 */
type RouterOutputs = inferRouterOutputs<AppRouter>

export { appRouter, type AppRouter } from "./root"
export { createTRPCContext } from "./trpc"
export type * from "./types"
export type { RouterInputs, RouterOutputs }
