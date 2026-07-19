"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { useTRPC } from "@/trpc/react"
import type { TaskType } from "@kando/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"

export default function DeleteTaskConfirmation({
  task,
  open,
  close,
}: {
  task: TaskType
  open: boolean
  close: () => void
}) {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const deleteTask = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tasks.pathFilter())
        toast.success("Task deleted")
        close()
      },
      onError: (error) => {
        console.error("Failed to delete task", error)
        toast.error("Failed to delete task")
      },
    })
  )
  const handleDeleteTask = async () => {
    await deleteTask.mutateAsync({ id: task.id })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete '${task.title}' task.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={deleteTask.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteTask}
            disabled={deleteTask.isPending}
          >
            {deleteTask.isPending ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
