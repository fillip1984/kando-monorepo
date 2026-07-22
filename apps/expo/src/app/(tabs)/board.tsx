import { trpc } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function BoardScreen() {
  const tasks = useQuery(trpc.tasks.readAll.queryOptions())

  return (
    <SafeAreaView>
      <View>
        <Text>Board</Text>
        {tasks.data?.map((task) => (
          <Text key={task.id}>{task.title}</Text>
        ))}
      </View>
    </SafeAreaView>
  )
}
