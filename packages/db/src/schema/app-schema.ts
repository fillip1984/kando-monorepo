import { TaskStatusEnumValues } from "../enum-values"
import { baseFields, baseSchema } from "./base"
import { taskPriorityPgEnum, taskStatusPgEnum } from "./enums"

export const tasks = baseSchema.table("task", (t) => ({
  ...baseFields,
  title: t.text().notNull(),
  description: t.text(),
  status: taskStatusPgEnum().notNull().default(TaskStatusEnumValues.TODO),
  priority: taskPriorityPgEnum(),
  dueDate: t.date({ mode: "string" }),
  position: t.integer(),
  emailSubjectLine: t.text(),
}))

export const comments = baseSchema.table("comment", (t) => ({
  ...baseFields,
  content: t.text().notNull(),
  taskId: t
    .text()
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
}))

export const checklistItems = baseSchema.table("checklist_item", (t) => ({
  ...baseFields,
  content: t.text().notNull(),
  complete: t.boolean().notNull().default(false),
  position: t.integer().notNull(),
  taskId: t
    .text()
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
}))

export const taskTags = baseSchema.table("task_tag", (t) => ({
  ...baseFields,
  taskId: t
    .text()
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  tagId: t
    .text()
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
}))

export const tags = baseSchema.table("tag", (t) => ({
  ...baseFields,
  name: t.text().notNull(),
  description: t.text(),
  color: t.text(),
}))
