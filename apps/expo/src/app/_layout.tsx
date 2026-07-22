import { queryClient } from "@/utils/api"
import { authClient } from "@/utils/auth"
import { Lucide } from "@react-native-vector-icons/lucide/static"
import {
  focusManager,
  onlineManager,
  QueryClientProvider,
} from "@tanstack/react-query"
import * as Network from "expo-network"
import { Tabs } from "expo-router"
import { useEffect, useState } from "react"
import type { AppStateStatus } from "react-native"
import { AppState, Platform, useColorScheme } from "react-native"
import "../styles.css"

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const colorScheme = useColorScheme()

  // refetch when network connection is restored
  onlineManager.setEventListener((setOnline) => {
    const eventSubscription = Network.addNetworkStateListener((state) => {
      setOnline(!!state.isConnected)
    })
    return () => eventSubscription.remove()
  })

  // refetch when app is made active again
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active")
    }
  }
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange)
    return () => subscription.remove()
  }, [])

  //auth
  const { data: session } = authClient.useSession()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!session?.user)
  }, [session])

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "rgb(30 41 59)",
            borderBlockColor: "rgb(30 41 59)",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Lucide name="house" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="board"
          options={{
            title: "Board",
            tabBarIcon: ({ color }) => (
              <Lucide name="library" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Lucide name="settings-2" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  )
}
