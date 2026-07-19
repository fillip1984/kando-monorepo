import type { RouterOutputs } from "."

export type TaskType = RouterOutputs["tasks"]["readAll"][number]
export type TagType = RouterOutputs["tags"]["readAll"][number]
export type ChecklistItemType = TaskType["checklistItems"][0]
export type CommentType = TaskType["comments"][0]
