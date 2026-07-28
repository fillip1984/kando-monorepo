import { trpc } from "@/utils/api"
import {
  DatePicker,
  Divider,
  Form,
  Host,
  Label,
  Picker,
  Section,
  Text,
  TextField,
  Toggle,
  useNativeState,
} from "@expo/ui/swift-ui"
import {
  datePickerStyle,
  fixedSize,
  foregroundStyle,
  lineLimit,
  tag,
} from "@expo/ui/swift-ui/modifiers"
import type { TaskPriorityEnumType, TaskStatusEnumType } from "@kando/db/enums"
import { TaskPriorityEnumValues, TaskStatusEnumValues } from "@kando/db/enums"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"

export default function TaskDetailsSheet() {
  const { id } = useLocalSearchParams()

  const readTaskById = useQuery(
    trpc.tasks.readById.queryOptions({ id: id as string }, { enabled: !!id })
  )

  const title = useNativeState("")
  const description = useNativeState("")
  const [status, setStatus] = useState<TaskStatusEnumType>("Todo")

  const [isDueDateOpen, setIsDueDateOpen] = useState(false)
  const [dueDate, setDueDate] = useState("")

  const [priority, setPriority] = useState<
    TaskPriorityEnumType | null | "None"
  >(null)
  const [position, setPosition] = useState(9999)

  useEffect(() => {
    if (readTaskById.data) {
      title.set(readTaskById.data.title)
      description.set(readTaskById.data.description ?? "")
      setStatus(readTaskById.data.status)
      setIsDueDateOpen(!!readTaskById.data.dueDate)
      setDueDate(readTaskById.data.dueDate ?? "")
      setPriority(readTaskById.data.priority ?? null)
      setPosition(readTaskById.data.position ?? 9999)
    }
  }, [readTaskById.data])

  const queryClient = useQueryClient()
  const updateTask = useMutation(
    trpc.tasks.update.mutationOptions({
      async onSuccess() {
        // setTitle("")
        // setDescription("")
        await queryClient.invalidateQueries(trpc.tasks.pathFilter())
      },
    })
  )
  const handleSubmit = async ({
    updates,
  }: {
    updates: {
      title: string
      description: string
      status: TaskStatusEnumType
      dueDate: string
      priority: TaskPriorityEnumType | null
      position: number
    }
  }) => {
    if (readTaskById.data) {
      await updateTask.mutateAsync({
        id: readTaskById.data.id,
        title: updates.title,
        description: updates.description || undefined,
        status: updates.status,
        dueDate: updates.dueDate || null,
        priority: updates.priority ?? null,
        position: updates.position,
      })
    }
  }

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <TextField
            placeholder="Task title..."
            text={title}
            onFocusChange={() => {
              void handleSubmit({
                updates: {
                  title: title.get(),
                  description: description.get(),
                  status,
                  dueDate,
                  priority,
                  position,
                },
              })
            }}
          />
          <TextField
            placeholder="Task description..."
            axis="vertical"
            text={description ?? ""}
            onFocusChange={() => {
              void handleSubmit({
                updates: {
                  title: title.get(),
                  description: description.get(),
                  status,
                  dueDate,
                  priority,
                  position,
                },
              })
            }}
            modifiers={[
              lineLimit(5),
              fixedSize({ horizontal: false, vertical: true }),
            ]}
          />
        </Section>

        <Section>
          <Picker
            label={
              <Label
                title="Swimlane"
                modifiers={[
                  foregroundStyle({ style: "primary", type: "hierarchical" }),
                ]}

                systemImage="rectangle.portrait"
              />
            }
            selection={status}
            onSelectionChange={(selection) => {
              setStatus(selection)
              void handleSubmit({
                updates: {
                  title: title.get(),
                  description: description.get(),
                  status: selection,
                  dueDate,
                  priority,
                  position,
                },
              })
            }}
          >
            {Object.values(TaskStatusEnumValues).map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {option}
              </Text>
            ))}
          </Picker>

          <Picker
            label={
              <Label
                title="Priority"
                modifiers={[
                  foregroundStyle({ style: "primary", type: "hierarchical" }),
                ]}

                systemImage="flag"
              />
            }
            selection={priority}
            onSelectionChange={(selection) => {
              setPriority(selection)
              void handleSubmit({
                updates: {
                  title: title.get(),
                  description: description.get(),
                  status,
                  dueDate,

                  priority: selection === "None" ? null : selection,
                  position,
                },
              })
            }}
          >
            <Text key="none" modifiers={[tag("None")]}>
              None
            </Text>
            <Divider />
            {Object.values(TaskPriorityEnumValues).map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {option}
              </Text>
            ))}
          </Picker>

          {/* TODO: can't do a label, maybe steal how it looks in apple's reminders... need to figure out how to animate reveals */}
          <Toggle
            label="Due Date"
            isOn={isDueDateOpen}
            onIsOnChange={(isOn) => {
              setIsDueDateOpen(isOn)
              setDueDate(isOn ? dueDate : "")
              if (!isOn) {
                void handleSubmit({
                  updates: {
                    title: title.get(),
                    description: description.get(),
                    status,
                    dueDate: "",
                    priority,
                    position,
                  },
                })
              }
            }}
          />
          {isDueDateOpen && (
            <DatePicker
              modifiers={[datePickerStyle("graphical")]}
              title="Due Date"
              selection={dueDate ? new Date(dueDate) : new Date()}
              displayedComponents={["date"]}
              onDateChange={(date) => {
                setDueDate(date.toDateString())
                void handleSubmit({
                  updates: {
                    title: title.get(),
                    description: description.get(),
                    status,
                    dueDate: date.toDateString(),
                    priority,
                    position,
                  },
                })
              }}
            />
          )}
        </Section>
      </Form>
    </Host>
  )
}
