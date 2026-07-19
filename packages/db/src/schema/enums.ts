import { TaskPriorityEnumValues, TaskStatusEnumValues } from "../enum-values"
import { baseSchema } from "./base"

export const taskStatusPgEnum = baseSchema.enum(
  "task_status",
  TaskStatusEnumValues
)

export const taskPriorityPgEnum = baseSchema.enum(
  "task_priority",
  TaskPriorityEnumValues
)
