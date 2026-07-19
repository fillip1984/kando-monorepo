"use client"

import DatePickerWithClear from "@/components/custom-ui/date-picker-with-clear"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroupAddon } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useTRPC } from "@/trpc/react"
import type { TaskPriorityEnumType, TaskStatusEnumType } from "@kando/db/enums"
import { TaskPriorityEnumValues, TaskStatusEnumValues } from "@kando/db/enums"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Flag, GoalIcon, Kanban } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function NewTaskForm({
  open,
  close,
}: {
  open: boolean
  close: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatusEnumType>("Todo")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<TaskPriorityEnumType | null>(null)

  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tasks.pathFilter())
        toast.success("Task created")
        close()
      },
      onError: (error) => {
        toast.error(`Failed to create task: ${error.message}`)
      },
    })
  )

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    await createTask.mutateAsync({
      title,
      description,
      status,
      dueDate,
      priority,
      position: 9999,
    })
  }

  const [isValid, setIsValid] = useState(false)
  useEffect(() => {
    setIsValid(title.trim().length > 0)
  }, [title])

  return (
    <Dialog open={open} onOpenChange={(open) => !open && close()}>
      <DialogContent className="w-3/4 sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <form
          id="new-task-form"
          onSubmit={handleSubmit}
          className="no-scrollbar -mx-4 grid max-h-[75vh] gap-4 overflow-y-auto px-4 lg:grid-cols-2"
        >
          <div className="space-y-3 lg:min-w-0">
            <Field>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full text-xl"
              />
            </Field>

            <Field>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full"
              />
            </Field>

            <FieldGroup className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Combobox
                items={Object.values(TaskStatusEnumValues)}
                value={status}
                onValueChange={(value) => {
                  setStatus(value ?? "Todo")
                }}
              >
                <ComboboxInput>
                  <InputGroupAddon>
                    <Kanban data-testid="status-icon" className="size-4" />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent className="w-full" align="center">
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <DatePickerWithClear
                value={dueDate}
                handleOnChange={(value) => {
                  const newDueDate = value
                  setDueDate(newDueDate)
                }}
                leadingIcon={<GoalIcon data-testid="due-date-icon" />}
                placeholder="Due date"
              />

              <Combobox
                items={Object.values(TaskPriorityEnumValues)}
                value={priority}
                onValueChange={(value) => {
                  const newPriority = value
                  setPriority(newPriority)
                }}
              >
                <ComboboxInput showClear placeholder="Priority">
                  <InputGroupAddon>
                    <Flag
                      data-testid="priority-field-icon"
                      className="size-4"
                    />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FieldGroup>
          </div>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            form="new-task-form"
            type="submit"
            disabled={!isValid || createTask.isPending}
          >
            {createTask.isPending ? <Spinner /> : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
