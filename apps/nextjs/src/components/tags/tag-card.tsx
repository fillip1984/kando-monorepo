import type { TagType } from "@kando/api"
import { PencilIcon, TagIcon } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export default function TagListCard({
  tag,
  onEdit,
}: {
  tag: TagType
  onEdit: () => void
}) {
  return (
    <li className="bg-background rounded-lg border p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{tag.name}</p>
          {tag.description ? (
            <p className="text-muted-foreground text-sm">{tag.description}</p>
          ) : null}
        </div>
        <Badge variant="outline" className="gap-1">
          <TagIcon className="size-3" />
          <span>{tag.color ?? "No color"}</span>
        </Badge>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        {tag.color ? (
          <div className="flex items-center gap-2">
            <span
              className="size-4 rounded-full border"
              style={{ backgroundColor: tag.color }}
            />
            <span className="text-muted-foreground text-xs">{tag.color}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">No color set</span>
        )}
        <Button variant="outline" size="sm" onClick={onEdit}>
          <PencilIcon className="size-3.5" />
          Edit
        </Button>
      </div>
    </li>
  )
}
