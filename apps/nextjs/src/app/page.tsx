"use client"

import { Badge } from "@/components/ui/badge"
import { parseDueDate } from "@/lib/task-utils"
import { useTRPC } from "@/trpc/react"
import type { TagType, TaskType } from "@kando/api"
import { useQuery } from "@tanstack/react-query"
import { isToday, startOfDay } from "date-fns"
import {
  CalendarClockIcon,
  CircleIcon,
  FlagIcon,
  ListTodoIcon,
  TagIcon,
} from "lucide-react"
import { useMemo } from "react"
import { TaskCard } from "./boards/swimlane/task/task-card"

export default function DashboardPage() {
  const trpc = useTRPC()
  const { data: tasks } = useQuery(trpc.tasks.readAll.queryOptions())
  const { data: tags } = useQuery(trpc.tags.readAll.queryOptions())

  const activeTasks = useMemo(
    () => tasks?.filter((task) => task.status !== "Done"),
    [tasks]
  )
  const todayStart = startOfDay(new Date())

  const overdue = activeTasks?.filter((task) => {
    const dueDate = parseDueDate(task.dueDate)
    return dueDate !== null && !isToday(dueDate) && dueDate < todayStart
  })

  const dueToday = activeTasks?.filter((task) => {
    const dueDate = parseDueDate(task.dueDate)
    return dueDate !== null && isToday(dueDate)
  })

  const upcoming = activeTasks?.filter((task) => {
    const dueDate = parseDueDate(task.dueDate)
    return dueDate !== null && !isToday(dueDate) && dueDate >= todayStart
  })

  const todoBacklog = activeTasks?.filter((task) => {
    const dueDate = parseDueDate(task.dueDate)
    return task.status === "Todo" && dueDate === null
  })

  const frantic = activeTasks?.filter((task) => task.priority === "Frantic")
  const urgent = activeTasks?.filter((task) => task.priority === "Urgent")
  const important = activeTasks?.filter((task) => task.priority === "Important")
  const unprioritized = activeTasks?.filter((task) => task.priority === null)

  const tasksByTag = useMemo(
    () =>
      tags?.map((tag) => ({
        tag,
        tasks: activeTasks?.filter((task) =>
          task.taskTags.some((todoTag) => todoTag.tagId === tag.id)
        ),
      })),
    [activeTasks, tags]
  )

  const untagged = useMemo(
    () => activeTasks?.filter((task) => task.taskTags.length === 0) ?? [],
    [activeTasks]
  )

  return (
    <div className="flex grow overflow-auto">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:p-6">
        <header className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Overdue, due today, upcoming, and todo lists with priority
            groupings.
          </p>
        </header>

        <section className="grid gap-4 xl:grid-cols-2">
          <TaskListGroup
            title="Overdue"
            icon={<CalendarClockIcon className="size-4" />}
            tasks={overdue ?? []}
            tone="destructive"
          />
          <TaskListGroup
            title="Due Today"
            icon={<CalendarClockIcon className="size-4" />}
            tasks={dueToday ?? []}
          />
          <TaskListGroup
            title="Upcoming"
            icon={<CalendarClockIcon className="size-4" />}
            tasks={upcoming ?? []}
          />
          <TaskListGroup
            title="Todo"
            icon={<ListTodoIcon className="size-4" />}
            tasks={todoBacklog ?? []}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <FlagIcon className="text-muted-foreground size-4" />
            <h2 className="font-heading text-lg font-medium">By Priority</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <TaskListGroup
              title="Frantic"
              icon={<CircleIcon className="size-3 fill-current" />}
              tasks={frantic ?? []}
              tone="destructive"
            />
            <TaskListGroup
              title="Urgent"
              icon={<CircleIcon className="size-3 fill-current" />}
              tasks={urgent ?? []}
              tone="default"
            />
            <TaskListGroup
              title="Important"
              icon={<CircleIcon className="size-3 fill-current" />}
              tasks={important ?? []}
              tone="secondary"
            />
            <TaskListGroup
              title="No Priority"
              icon={<CircleIcon className="size-3" />}
              tasks={unprioritized ?? []}
              tone="outline"
            />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <TagIcon className="text-muted-foreground size-4" />
            <h2 className="font-heading text-lg font-medium">By Tag</h2>
          </div>

          {tags?.length === 0 ? (
            <article className="bg-card text-muted-foreground rounded-xl border p-4 text-sm">
              No tags yet. Create tags from the Tags page to group tasks here.
            </article>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {tasksByTag?.map(({ tag, tasks }) => (
                <TaskListGroup
                  key={tag.id}
                  title={tag.name}
                  icon={<TagSwatch tag={tag} />}
                  tasks={tasks ?? []}
                  tone="outline"
                />
              ))}
              <TaskListGroup
                title="Untagged"
                icon={<TagIcon className="size-4" />}
                tasks={untagged}
                tone="secondary"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

const TagSwatch = ({ tag }: { tag: TagType }) => {
  return tag.color ? (
    <span
      className="border-border/70 size-12 rounded-full border-3"
      style={{ backgroundColor: tag.color }}
      aria-hidden="true"
    />
  ) : (
    <TagIcon className="size-4" />
  )
}

const TaskListGroup = ({
  title,
  icon,
  tasks,
  tone = "outline",
}: {
  title: string
  icon: React.ReactNode
  tasks: TaskType[]
  tone?: "default" | "secondary" | "destructive" | "outline"
}) => {
  return (
    <article className="bg-card rounded-xl border">
      <header className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">{icon}</span>
          <span>{title}</span>
        </div>
        <Badge variant={tone}>{tasks.length}</Badge>
      </header>

      {tasks.length === 0 ? (
        <p className="text-muted-foreground p-3 text-sm">
          No tasks in this list.
        </p>
      ) : (
        <ul className="space-y-2 p-2">
          {tasks.map((task) => (
            <TaskListItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </article>
  )
}

const TaskListItem = ({ task }: { task: TaskType }) => {
  return (
    <li>
      <TaskCard task={task} />
    </li>
  )
}
