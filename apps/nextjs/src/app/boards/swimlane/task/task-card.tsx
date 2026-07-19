"use client"

import {
  FlagIcon,
  GoalIcon,
  ListChecksIcon,
  MessageCircleIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { isOverdue } from "@/lib/task-utils"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { TaskType } from "@kando/api"
import DeleteTaskConfirmation from "./delete-task-confirmation"
import { TaskDialog } from "./task-dialog"

export function TaskCard({ task }: { task: TaskType }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false)

  return (
    <>
      <div
        key={task.id}
        onClick={() => setIsOpen(true)}
        className="bg-background hover:bg-muted/50 flex h-26 shrink-0 cursor-pointer flex-col rounded-lg border p-2 transition-colors select-none"
      >
        <div className="flex grow flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 text-sm font-medium">{task.title}</p>
            <Button
              variant="destructive"
              size="icon-xs"
              aria-label="Delete task"
              onClick={(event) => {
                event.stopPropagation()
                setIsDeleteConfirmationOpen(true)
              }}
            >
              <Trash2Icon className="size-3" />
            </Button>
          </div>
          {task.description ? (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {task.description}
            </p>
          ) : null}
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {task.dueDate ? (
            <Badge
              variant={isOverdue(task, new Date()) ? "destructive" : "outline"}
              aria-label={`Due date ${task.dueDate}`}
            >
              <GoalIcon data-testid="due-date-icon" />
              <span>{task.dueDate}</span>
            </Badge>
          ) : null}
          {task.priority ? (
            <Badge
              variant="outline"
              className={`${
                task.priority === "Frantic"
                  ? "bg-destructive text-white"
                  : task.priority === "Urgent"
                    ? "bg-amber-200 text-black"
                    : "outline"
              }`}
              aria-label={`Priority ${task.priority}`}
            >
              <FlagIcon data-testid="priority-icon" />
              <span className="capitalize">{task.priority}</span>
            </Badge>
          ) : null}
          {task.checklistItems.length > 0 ? (
            <Badge
              variant="outline"
              aria-label={`Checklist items ${task.checklistItems.length}`}
            >
              <ListChecksIcon />
              <span>
                {task.checklistItems.filter((item) => item.complete).length}/
                {task.checklistItems.length}
              </span>
            </Badge>
          ) : null}
          {task.comments.length > 0 ? (
            <Badge
              variant="outline"
              aria-label={`Comments ${task.comments.length}`}
            >
              <MessageCircleIcon />
              <span>{task.comments.length}</span>
            </Badge>
          ) : null}
          {task.taskTags.slice(0, 2).map((taskTag) => (
            <Badge key={taskTag.id} variant="outline">
              {taskTag.tag?.color ? (
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: taskTag.tag.color }}
                />
              ) : null}
              <span>{taskTag.tag?.name || "Tag"}</span>
            </Badge>
          ))}
          {task.taskTags.length > 2 ? (
            <Badge variant="outline">+{task.taskTags.length - 2}</Badge>
          ) : null}
        </div>
      </div>

      <TaskDialog task={task} open={isOpen} close={() => setIsOpen(false)} />
      <DeleteTaskConfirmation
        task={task}
        open={isDeleteConfirmationOpen}
        close={() => setIsDeleteConfirmationOpen(false)}
      />
    </>
  )
}
