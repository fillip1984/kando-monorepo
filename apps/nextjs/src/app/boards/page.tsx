"use client"

import { useTRPC } from "@/trpc/react"
import { animations } from "@formkit/drag-and-drop"
import { useDragAndDrop } from "@formkit/drag-and-drop/react"
import type { TaskType } from "@kando/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Swimlane } from "./swimlane/swimlane"

export default function BoardPage() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const {
    data: tasks,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.tasks.readAll.queryOptions())

  const reorderTasks = useMutation(
    trpc.tasks.reorderTasks.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tasks.pathFilter())
      },
    })
  )

  // DnD Stuff
  const config = {
    group: "kanban-board",
    onDragend: async (event: unknown) => {
      const status = (event as any).parent.el.dataset.columnId
      const dragEvent = event as { values: TaskType[] }
      const updates = dragEvent.values.map((task, i) => ({
        taskId: task.id,
        title: task.title,
        status,
        position: i,
      }))
      console.log("drag ended", updates)
      await reorderTasks.mutateAsync({ updates })
    },
    plugins: [animations()],
  }

  const [todoTasksRef, todos, setTodoTasks] = useDragAndDrop<
    HTMLDivElement,
    TaskType
  >([], config)
  const [inProgressTasksRef, inProgress, setInProgressTasks] = useDragAndDrop<
    HTMLDivElement,
    TaskType
  >([], config)
  const [blockedTasksRef, blocked, setBlockedTasks] = useDragAndDrop<
    HTMLDivElement,
    TaskType
  >([], config)
  const [doneTasksRef, done, setDoneTasks] = useDragAndDrop<
    HTMLDivElement,
    TaskType
  >([], config)

  useEffect(() => {
    if (!tasks) return

    setTodoTasks(tasks.filter((task) => task.status === "Todo"))
    setInProgressTasks(tasks.filter((task) => task.status === "In Progress"))
    setBlockedTasks(tasks.filter((task) => task.status === "Blocked"))
    setDoneTasks(tasks.filter((task) => task.status === "Done"))
  }, [tasks])

  return (
    <div className="flex grow overflow-hidden p-4">
      <div className="flex grow gap-4 overflow-x-auto">
        <Swimlane ref={todoTasksRef} lane="Todo" tasks={todos} />
        <Swimlane
          ref={inProgressTasksRef}
          lane="In Progress"
          tasks={inProgress}
        />
        <Swimlane ref={blockedTasksRef} lane="Blocked" tasks={blocked} />
        <Swimlane ref={doneTasksRef} lane="Done" tasks={done} />
      </div>
    </div>
  )
}
