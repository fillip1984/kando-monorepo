"use client"

import type { TaskType } from "@kando/api"
import Lucide from "@react-native-vector-icons/lucide"
import { Link } from "expo-router"
import { Text, View } from "react-native"
import { Badge } from "./ui/badge"

export function TaskCard({ task }: { task: TaskType }) {
  return (
    <Link
      href={"/(task)/new-task-sheet"}
      className="flex shrink-0 flex-col rounded-lg border p-2"
    >
      <View className="flex flex-col">
        <View className="flex-row items-start justify-between">
          <Text className="line-clamp-1 text-sm font-medium">{task.title}</Text>
          {/* <Button
              variant="destructive"
              size="icon-xs"
              onPress={() => {
                setIsDeleteConfirmationOpen(true)
              }}
            >
              <Lucide name="trash-2" size={24} color="red" />
            </Button> */}
        </View>
        {task.description ? (
          <Text className="text-muted-foreground line-clamp-2 text-xs">
            {task.description}
          </Text>
        ) : null}
      </View>

      {/* footer */}
      <View className="flex-row flex-wrap items-center gap-2 py-2 text-xs">
        {task.dueDate ? (
          <Badge
            variant="outline"
            // variant={isOverdue(task, new Date()) ? "destructive" : "outline"}
          >
            <Lucide name="goal" color="black" data-testid="due-date-icon" />
            <Text>{task.dueDate}</Text>
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
          >
            <Lucide name="flag" color="black" data-testid="priority-icon" />
            <Text className="text-xs">{task.priority}</Text>
          </Badge>
        ) : null}
        {task.checklistItems.length > 0 ? (
          <Badge variant="outline">
            <Lucide name="list-checks" color="black" />
            <Text>
              {task.checklistItems.filter((item) => item.complete).length}/
              {task.checklistItems.length}
            </Text>
          </Badge>
        ) : null}
        {task.comments.length > 0 ? (
          <Badge variant="outline">
            <Lucide name="message-circle" color="black" />
            <Text>{task.comments.length}</Text>
          </Badge>
        ) : null}
        {task.taskTags.slice(0, 2).map((taskTag) => (
          <Badge key={taskTag.id} variant="outline">
            {taskTag.tag?.color ? (
              <View
                className="size-2 rounded-full"
                style={{ backgroundColor: taskTag.tag.color }}
              />
            ) : null}
            <Text>{taskTag.tag?.name ?? "Tag"}</Text>
          </Badge>
        ))}
        {task.taskTags.length > 2 ? (
          <Badge variant="outline">+{task.taskTags.length - 2}</Badge>
        ) : null}
      </View>
    </Link>
  )
}
