import { trpc } from "@/utils/api"
import {
  Button,
  Form,
  Host,
  Section,
  TextField,
  useNativeState,
} from "@expo/ui/swift-ui"
import { fixedSize, lineLimit } from "@expo/ui/swift-ui/modifiers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"

export default function NewTaskSheet() {
  const title = useNativeState("")
  const description = useNativeState("")

  const router = useRouter()
  const queryClient = useQueryClient()
  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.tasks.pathFilter())
        router.dismiss()
        title.set("")
        description.set("")
      },
    })
  )

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <TextField placeholder="Task title..." text={title} />
          <TextField
            placeholder="Task description..."
            axis="vertical"
            text={description}
            modifiers={[
              lineLimit(5),
              fixedSize({ horizontal: false, vertical: true }),
            ]}
          />
        </Section>
        <Button
          label="Create Task"
          onPress={() => {
            createTask.mutate({
              title: title.get(),
              description: description.get(),
              status: "Todo",
              position: 9999,
            })
          }}
        />
      </Form>
    </Host>
  )
}
