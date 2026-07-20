import { LegendList } from "@legendapp/list"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, Stack } from "expo-router"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import type { RouterOutputs } from "@/utils/api"
import { trpc } from "@/utils/api"
import { authClient } from "@/utils/auth"

function TaskCard(props: {
  task: RouterOutputs["tasks"]["readAll"][number]
  onDelete: () => void
}) {
  return (
    <View className="bg-muted flex flex-row rounded-lg p-4">
      <View className="grow">
        <Link
          asChild
          href={{
            pathname: "/task/[id]",
            params: { id: props.task.id },
          }}
        >
          <Pressable className="">
            <Text className="text-primary text-xl font-semibold">
              {props.task.title}
            </Text>
            <Text className="text-foreground mt-2">
              {props.task.description}
            </Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={props.onDelete}>
        <Text className="text-primary font-bold uppercase">Delete</Text>
      </Pressable>
    </View>
  )
}

function CreateTask() {
  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const { mutate, error } = useMutation(
    trpc.tasks.create.mutationOptions({
      async onSuccess() {
        setTitle("")
        setDescription("")
        await queryClient.invalidateQueries(trpc.tasks.readAll.queryFilter())
      },
    })
  )

  return (
    <View className="mt-4 flex gap-2">
      <TextInput
        className="border-input bg-background text-foreground items-center rounded-md border px-3 text-lg leading-tight"
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text className="text-destructive mb-2">
          {error.data.zodError.fieldErrors.title}
        </Text>
      )}
      <TextInput
        className="border-input bg-background text-foreground items-center rounded-md border px-3 text-lg leading-tight"
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      {error?.data?.zodError?.fieldErrors.description && (
        <Text className="text-destructive mb-2">
          {error.data.zodError.fieldErrors.description}
        </Text>
      )}
      <Pressable
        className="bg-primary flex items-center rounded-sm p-2"
        onPress={() => {
          mutate({
            title,
            description,
            position: 9999,
            status: "Todo",
          })
        }}
      >
        <Text className="text-foreground">Create</Text>
      </Pressable>
      {error?.data?.code === "UNAUTHORIZED" && (
        <Text className="text-destructive mt-2">
          You need to be logged in to create a task
        </Text>
      )}
    </View>
  )
}

function MobileAuth() {
  const { data: session } = authClient.useSession()

  return (
    <>
      <Text className="text-foreground pb-2 text-center text-xl font-semibold">
        {session?.user.name ? `Hello, ${session.user.name}` : "Not logged in"}
      </Text>
      <Pressable
        onPress={() =>
          session
            ? authClient.signOut()
            : authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
              })
        }
        className="bg-primary flex items-center rounded-sm p-2"
      >
        <Text>{session ? "Sign Out" : "Sign In With Google"}</Text>
      </Pressable>
    </>
  )
}

export default function Index() {
  const queryClient = useQueryClient()

  const taskQuery = useQuery(trpc.tasks.readAll.queryOptions())

  const deleteTaskMutation = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSettled: () =>
        queryClient.invalidateQueries(trpc.tasks.readAll.queryFilter()),
    })
  )

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <Text className="text-foreground pb-2 text-center text-5xl font-bold">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <MobileAuth />

        <View className="py-2">
          <Text className="text-primary font-semibold italic">
            Press on a task
          </Text>
        </View>

        <LegendList
          data={taskQuery.data ?? []}
          estimatedItemSize={20}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <TaskCard
              task={p.item}
              onDelete={() => deleteTaskMutation.mutate({ id: p.item.id })}
            />
          )}
        />

        <CreateTask />
      </View>
    </SafeAreaView>
  )
}
