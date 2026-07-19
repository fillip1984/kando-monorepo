export const TaskPriorityEnumValues = {
  IMPORTANT: "Important",
  URGENT: "Urgent",
  FRANTIC: "Frantic",
} as const
export type TaskPriorityEnumType =
  (typeof TaskPriorityEnumValues)[keyof typeof TaskPriorityEnumValues]

export const TaskStatusEnumValues = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  DONE: "Done",
} as const
export type TaskStatusEnumType =
  (typeof TaskStatusEnumValues)[keyof typeof TaskStatusEnumValues]
