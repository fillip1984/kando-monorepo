import { trpc } from "@/utils/api"
import { Host, List } from "@expo/ui/swift-ui"
import { useQuery } from "@tanstack/react-query"
import React from "react"
import { Text } from "react-native"

export default function Tags() {
  const tags = useQuery(trpc.tags.readAll.queryOptions())

  return (
    <Host style={{ flex: 1 }}>
      <List>
        {tags.data?.map((tag) => (
          <Text key={tag.id}>{tag.name}</Text>
        ))}
      </List>
    </Host>
  )
}
