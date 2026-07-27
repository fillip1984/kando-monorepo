import { TaskCard } from "@/components/task-card"
import { trpc } from "@/utils/api"
import Lucide from "@react-native-vector-icons/lucide/static"
import { useQuery } from "@tanstack/react-query"
import { Link } from "expo-router"
import { Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function BoardScreen() {
  const tasks = useQuery(trpc.tasks.readAll.queryOptions())

  return (
    <SafeAreaView className="relative">
      <View className="flex h-screen bg-olive-300 p-2">
        <View className="flex gap-1">
          {tasks.data?.map((task) => (
            // <Text key={task.id}>{task.title}</Text>
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
        <Link href={"/(task)/new-task-sheet"} asChild>
          <Pressable className="absolute right-4 bottom-40 flex size-16 items-center justify-center rounded-full bg-black">
            <Lucide name="plus" size={42} color="white" />
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  )
}
