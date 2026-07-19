"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { PlusIcon } from "lucide-react"
import { useState } from "react"

import LoadingAndRetry from "@/components/nav/loading-and-retry"
import TagListCard from "@/components/tags/tag-card"
import TagDialog from "@/components/tags/tag-dialog"
import { useTRPC } from "@/trpc/react"
import type { TagType } from "@kando/api"
import { useQuery } from "@tanstack/react-query"

export default function TagsPage() {
  const trpc = useTRPC()
  const {
    data: tags,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.tags.readAll.queryOptions())

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)

  const openCreateDialog = () => {
    setSelectedTag(null)
    setDialogOpen(true)
  }

  const openEditDialog = (tag: TagType) => {
    setSelectedTag(tag)
    setDialogOpen(true)
  }

  if (isLoading || isError) {
    return (
      <LoadingAndRetry
        isLoading={isLoading}
        isError={isError}
        retry={refetch}
      />
    )
  }

  return (
    <>
      <div className="flex grow overflow-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
          <header className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h1 className="font-heading text-2xl font-semibold">Tags</h1>
                <p className="text-muted-foreground text-sm">
                  Review existing tags and manage them from a dialog.
                </p>
              </div>
              <Button onClick={openCreateDialog}>
                <PlusIcon className="size-4" />
                Create Tag
              </Button>
            </div>
          </header>

          <section className="bg-card rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-heading text-lg font-medium">
                Existing Tags
              </h2>
              <Badge variant="outline">{tags?.length}</Badge>
            </div>

            {tags?.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No tags yet. Create your first one.
              </p>
            ) : (
              <ul className="space-y-2">
                {tags?.map((tag) => (
                  <TagListCard
                    key={tag.id}
                    tag={tag}
                    onEdit={() => openEditDialog(tag)}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <TagDialog
        open={dialogOpen}
        tag={selectedTag}
        close={() => setDialogOpen(false)}
      />
    </>
  )
}
