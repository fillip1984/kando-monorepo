import { defineRelations } from "drizzle-orm"

import * as schema from "./index"

export const relations = defineRelations(schema, (r) => ({
  tasks: {
    checklistItems: r.many.checklistItems(),
    comments: r.many.comments(),
    taskTags: r.many.taskTags(),
  },
  checklistItems: {
    task: r.one.tasks({
      from: r.checklistItems.taskId,
      to: r.tasks.id,
    }),
  },
  comments: {
    task: r.one.tasks({
      from: r.comments.taskId,
      to: r.tasks.id,
    }),
  },
  tags: {
    taskTags: r.many.taskTags(),
  },
  taskTags: {
    task: r.one.tasks({
      from: r.taskTags.taskId,
      to: r.tasks.id,
    }),
    tag: r.one.tags({
      from: r.taskTags.tagId,
      to: r.tags.id,
    }),
  },
}))
