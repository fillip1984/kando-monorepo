import { useQuery } from "@tanstack/react-query"
import { Stack, useGlobalSearchParams } from "expo-router"
import { Text, View } from "react-native"

import { trpc } from "@/utils/api"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Task() {
  const { id } = useGlobalSearchParams<{ id: string }>()
  const { data } = useQuery(trpc.tasks.readById.queryOptions({ id }))

  if (!data) return null

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: data.title }} />
      <View className="h-full w-full p-4">
        <Text className="text-primary py-2 text-3xl font-bold">
          {data.title}
        </Text>
        <Text className="text-foreground py-4">{data.description}</Text>
      </View>
    </SafeAreaView>
  )
}
