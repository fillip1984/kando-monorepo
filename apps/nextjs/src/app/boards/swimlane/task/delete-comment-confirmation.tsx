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
import type { CommentType } from "@kando/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"

export default function DeleteCommentConfirmation({
  comment,
  open,
  close,
}: {
  comment: CommentType
  open: boolean
  close: () => void
}) {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const deleteComment = useMutation(
    trpc.tasks.deleteComment.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.tasks.pathFilter())
        toast.success("Comment deleted")
        close()
      },
      onError: (error) => {
        console.error("Failed to delete comment", error)
        toast.error("Failed to delete comment")
      },
    })
  )
  const handleDeleteComment = async () => {
    await deleteComment.mutateAsync({ id: comment.id })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete '${comment.content}' comment.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            disabled={deleteComment.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteComment}
            disabled={deleteComment.isPending}
          >
            {deleteComment.isPending ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
