"use client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTRPC } from "@/trpc/react"
import type { TaskType } from "@kando/api"
import type { TaskStatusEnumType } from "@kando/db/enums"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { TaskCard } from "./task/task-card"

export function Swimlane({
  lane,
  tasks,
  ref,
}: {
  lane: string
  tasks: TaskType[]
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <>
      <div className="border-border/70 bg-card relative flex w-100 shrink-0 grow flex-col overflow-hidden rounded-xl border shadow-sm">
        <header className="mb-2 flex items-center justify-between p-2">
          <h2 className="font-heading text-base">{lane}</h2>
          <span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
            {tasks.length}
          </span>
        </header>

        <div
          ref={ref}
          data-column-id={lane}
          className="flex min-h-4 flex-col gap-1 overflow-y-auto px-4"
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          <NewInlineTask lane={lane} tasks={tasks} />
        </div>

        {/* <NewTaskFromOutlookOverlay tasks={tasks} lane={lane} /> */}
      </div>
    </>
  )
}

const NewInlineTask = ({
  lane,
  tasks,
}: {
  lane: string
  tasks: TaskType[]
}) => {
  const [isEditMode, setIsEditMode] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const titleRef = useRef<HTMLInputElement>(null)
  const newInlineTaskDivRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isEditMode) {
      titleRef.current?.focus()
    }
  }, [isEditMode])
  useEffect(() => {
    // make sure full inline task card is visible
    if (isEditMode) {
      newInlineTaskDivRef.current?.scrollIntoView()
    }
  }, [isEditMode])
  useEffect(() => {
    // if you click outside of the div change to not editing
    const handleClickOutside = (e: MouseEvent) => {
      if (
        newInlineTaskDivRef.current &&
        !newInlineTaskDivRef.current.contains(e.target as Node)
      ) {
        setIsEditMode(false)
      }
    }
    if (isEditMode) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditMode])

  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tasks.pathFilter())
      },
    })
  )
  const handleCreateTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title) return
    const nextPosition =
      tasks.reduce(
        (maxPosition, task) => Math.max(maxPosition, task.position ?? -1),
        -1
      ) + 1
    await createTask.mutateAsync({
      title,
      description,
      position: nextPosition,
      status: lane as TaskStatusEnumType,
    })

    setTitle("")
    setDescription("")
    titleRef.current?.focus()
    newInlineTaskDivRef.current?.scrollIntoView()
  }

  return (
    <div className="no-drag m-4" ref={newInlineTaskDivRef}>
      {!isEditMode ? (
        <Button
          variant="ghost"
          onClick={() => setIsEditMode(true)}
          className="text-muted-foreground flex w-full items-center justify-start gap-1"
        >
          <PlusIcon className="text-primary size-4" />
          <span>Add Task</span>
        </Button>
      ) : (
        <form onSubmit={handleCreateTask} className="flex flex-col gap-1">
          <Field>
            <Input
              ref={titleRef}
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field>
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Button disabled={!title} type="submit">
            Save
          </Button>
          <Button variant="ghost" onClick={() => setIsEditMode(false)}>
            Cancel
          </Button>
        </form>
      )}
    </div>
  )
}

// const NewTaskFromOutlookOverlay = ({
//   tasks,
//   lane,
// }: {
//   tasks: TaskType[]
//   lane: string
// }) => {
//   const [isDragStart, setIsDragStart] = useState(false)
//   const [isDragReady, setIsDragReady] = useState(false)
//   const dragDepthRef = useRef(0)

//   const router = useRouter()
//   const uploadMsgFn = useServerFn(parseOutlookMsg)
//   const createTask = useServerFn(createTaskFn)
//   const nextPosition =
//     tasks.reduce(
//       (maxPosition, task) => Math.max(maxPosition, task.position ?? -1),
//       -1
//     ) + 1

//   useEffect(() => {
//     window.addEventListener("dragenter", (e) =>
//       setIsDragStart(isFileDrag(e as unknown as DragEvent<unknown>))
//     )

//     return () => {
//       window.removeEventListener("dragenter", () => setIsDragStart(false))
//     }
//   }, [])

//   const isFileDrag = (e: DragEvent<unknown>) => {
//     const items = Array.from(e.dataTransfer.items)

//     if (items.length === 0) {
//       return false
//     }

//     const isFile = items.some((item) => item.kind === "file")

//     return isFile
//   }

//   const handleDrag = (e: DragEvent<unknown>) => {
//     e.preventDefault()
//     e.stopPropagation()

//     const isMsgDrag = isFileDrag(e)

//     if (e.type === "dragenter") {
//       dragDepthRef.current += 1
//       setIsDragReady(isMsgDrag)
//       return
//     }

//     if (e.type === "dragover") {
//       if (isMsgDrag) {
//         e.dataTransfer.dropEffect = "copy"
//       }
//       setIsDragReady(isMsgDrag)
//       return
//     }

//     if (e.type === "dragleave") {
//       dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

//       if (dragDepthRef.current === 0) {
//         setIsDragReady(false)
//       }
//     }
//   }

//   const handleDrop = async (e: DragEvent<unknown>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     dragDepthRef.current = 0
//     setIsDragReady(false)
//     setIsDragStart(false)

//     if (e.dataTransfer.files.length > 0) {
//       await processMsgFile(e.dataTransfer.files[0])
//     }
//   }

//   const processMsgFile = async (msgFile: File) => {
//     const formData = new FormData()
//     formData.append("file", msgFile)

//     const { subject, body } = await uploadMsgFn({ data: formData })

//     await createTask({
//       data: {
//         title: subject ?? "No subject",
//         description: body ?? "",
//         position: nextPosition,
//         status: lane as TaskStatusEnumType,
//       },
//     })
//     router.invalidate()
//   }

//   return (
//     <div
//       onDragEnter={handleDrag}
//       onDragOver={handleDrag}
//       onDragLeave={handleDrag}
//       className={`${isDragStart ? "pointer-events-auto" : "pointer-events-none"} absolute top-0 right-0 bottom-0 left-0`}
//     >
//       <div
//         onDrop={handleDrop}
//         className={`${isDragReady ? "visible" : "hidden"}`}
//       >
//         {/* backdrop */}
//         <div className="absolute inset-0 z-998 bg-black/30 backdrop-blur"></div>

//         <div className="absolute inset-2 z-999 flex flex-col items-center justify-center">
//           <CloudUploadIcon className="text-muted-foreground size-12" />
//           <p>Add task via Outlook email</p>
//         </div>
//       </div>
//     </div>
//   )
// }
