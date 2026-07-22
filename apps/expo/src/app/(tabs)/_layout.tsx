import { authClient } from "@/utils/auth"
import { focusManager, onlineManager } from "@tanstack/react-query"
import * as Network from "expo-network"
import { NativeTabs } from "expo-router/build/native-tabs"
import { useEffect, useState } from "react"
import type { AppStateStatus } from "react-native"
import { AppState, Platform, useColorScheme } from "react-native"
// import "../styles.css"

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
    // <QueryClientProvider client={queryClient}>
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="house" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="board">
        <NativeTabs.Trigger.Icon sf="square.grid.2x2.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gearshape.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
    // </QueryClientProvider>
  )
}
