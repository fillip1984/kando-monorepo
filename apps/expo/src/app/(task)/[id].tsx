import { Input } from "@/components/ui/input"
import { trpc } from "@/utils/api"
import Lucide from "@react-native-vector-icons/lucide/static"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Pressable, View } from "react-native"

export default function TaskDetailsSheet() {
  const { id } = useLocalSearchParams()

  const readTaskById = useQuery(
    trpc.tasks.readById.queryOptions({ id: id as string }, { enabled: !!id })
  )
  useEffect(() => {
    if (readTaskById.data) {
      setTitle(readTaskById.data.title)
      setDescription(readTaskById.data.description ?? "")
    }
  }, [readTaskById.data])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const queryClient = useQueryClient()
  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      async onSuccess() {
        setTitle("")
        setDescription("")
        await queryClient.invalidateQueries(trpc.tasks.pathFilter())
      },
    })
  )

  return (
    <View className="flex gap-2 p-4">
      <Input
        value={title}
        onChange={setTitle}
        placeholder="Task title"
        className="w-full text-xl"
      />

      <Input
        value={description}
        onChange={setDescription}
        placeholder="Description (optional)"
        className="w-full"
      />
      <Pressable
        className="ml-auto size-10 rounded-full bg-blue-500 p-2"
        onPress={() => {
          createTask.mutate({
            title,
            description,
            status: "Todo",
            position: 9999,
          })
        }}
      >
        <Lucide name="plus" color="white" size={24} />
      </Pressable>
    </View>
  )
}
