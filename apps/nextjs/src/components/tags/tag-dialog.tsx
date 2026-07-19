"use client"

import { useTRPC } from "@/trpc/react"
import type { TagType } from "@kando/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
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
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import { Textarea } from "../ui/textarea"

const tagColorOptions = [
  "#16a34a",
  "#0f766e",
  "#0284c7",
  "#4f46e5",
  "#7c3aed",
  "#c026d3",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
]

function getRandomTagColor(): string {
  return (
    tagColorOptions[Math.floor(Math.random() * tagColorOptions.length)] ??
    "#16a34a"
  )
}

export default function TagDialog({
  open,
  tag,
  close,
}: {
  open: boolean
  tag: TagType | null
  close: () => void
}) {
  const isNew = tag === null

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#16a34a")
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    setName(tag?.name ?? "")
    setDescription(tag?.description ?? "")
    setColor(tag?.color ?? getRandomTagColor())
    setDeleteConfirmationOpen(false)
  }, [open, tag])

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const createTag = useMutation(
    trpc.tags.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tags.pathFilter())
        toast.success(`Tag '${name}' created`)
        close()
      },
      onError: (error) => {
        console.error("Failed to create tag", error)
        toast.error("Failed to create tag")
      },
    })
  )
  const updateTag = useMutation(
    trpc.tags.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tags.pathFilter())
        toast.success("Tag updated")
        close()
      },
      onError: (error) => {
        console.error("Failed to update tag", error)
        toast.error("Failed to update tag")
      },
    })
  )
  const handleSubmit = async () => {
    const normalizedName = name.trim()
    if (!normalizedName) {
      return
    }

    if (isNew) {
      await createTag.mutateAsync({
        name: normalizedName,
        description: description.trim() || null,
        color,
      })
    } else {
      await updateTag.mutateAsync({
        id: tag.id,
        name: normalizedName,
        description: description.trim() || null,
        color,
      })
    }
  }

  const deleteTag = useMutation(
    trpc.tags.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tags.pathFilter())
        toast.success("Tag deleted")
        setDeleteConfirmationOpen(false)
        close()
      },
      onError: (error) => {
        console.error("Failed to delete tag", error)
        toast.error("Failed to delete tag")
      },
    })
  )
  const handleDelete = async () => {
    if (tag === null) {
      return
    }

    await deleteTag.mutateAsync({ id: tag.id })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && close()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isNew ? "Create Tag" : "Edit Tag"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="tag-name-dialog">
                Name
              </label>
              <Input
                id="tag-name-dialog"
                placeholder="Example: Backend"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label
                className="text-sm font-medium"
                htmlFor="tag-description-dialog"
              >
                Description
              </label>
              <Textarea
                id="tag-description-dialog"
                placeholder="Optional context for when to use this tag"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="tag-color-dialog">
                Color
              </label>
              <div className="flex items-center gap-3">
                <Input
                  id="tag-color-dialog"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-10 w-18 rounded-md px-1"
                />
                <span className="text-muted-foreground text-sm">{color}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            {!isNew ? (
              <Button
                variant="destructive"
                className="mr-auto"
                disabled={
                  createTag.isPending ||
                  updateTag.isPending ||
                  deleteTag.isPending
                }
                onClick={() => setDeleteConfirmationOpen(true)}
              >
                <Trash2Icon className="size-4" />
                Delete Tag
              </Button>
            ) : null}
            <DialogClose
              render={
                <Button
                  variant="outline"
                  disabled={
                    createTag.isPending ||
                    updateTag.isPending ||
                    deleteTag.isPending
                  }
                >
                  Cancel
                </Button>
              }
            />
            <Button
              disabled={
                createTag.isPending ||
                updateTag.isPending ||
                deleteTag.isPending ||
                !name.trim()
              }
              onClick={handleSubmit}
            >
              {createTag.isPending || updateTag.isPending ? (
                <Spinner />
              ) : isNew ? (
                "Create Tag"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteConfirmationOpen}
        onOpenChange={(nextOpen) =>
          !nextOpen && setDeleteConfirmationOpen(false)
        }
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete tag?</AlertDialogTitle>
            <AlertDialogDescription>
              {tag
                ? `This will permanently delete '${tag.name}'.`
                : "This will permanently delete this tag."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" disabled={deleteTag.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteTag.isPending}
              onClick={handleDelete}
            >
              {deleteTag.isPending ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
