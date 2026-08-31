import "@/global.css"
import { useAppStore } from "@/stores/app-store"
import { queryClient } from "@/utils/api"
import { authClient } from "@/utils/auth"
import {
  checkIfBiometricsAvailable,
  triggerLocalBiometrics,
} from "@/utils/biometric-utils"
import { colors } from "@/utils/color-utils"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack, useFocusEffect } from "expo-router"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { toast, Toaster } from "sonner-native"

export default function RootLayout() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { isAuthenticated, setIsAuthenticated } = useAppStore()

  if (isAuthenticated()) {
    return <MainLayout />
  } else {
    return <Login setIsAuthenticated={setIsAuthenticated} />
  }
}

const MainLayout = () => {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(task)/new-task-sheet"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.5, 1],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              contentStyle: {
                backgroundColor: "#ffffff", // Set your solid color here
              },
            }}
          />
          <Stack.Screen
            name="(task)/[id]"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: [0.5, 0.75, 1],
              sheetInitialDetentIndex: 1,
              sheetGrabberVisible: true,
              contentStyle: {
                backgroundColor: "#ffffff", // Set your solid color here
              },
            }}
          />
          <Stack.Screen
            name="(task)/[id]/tags"
            options={{ presentation: "formSheet" }}
          />
        </Stack>
        <Toaster />
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

const Login = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void
}) => {
  const [loading, setLoading] = useState(false)
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false)
  const { data: session } = authClient.useSession()

  // authenticate using google social login
  const handleSignIn = async () => {
    try {
      setLoading(true)
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      // couldn't set isAuthenticated to true here because user could click cancel on the prompt to open a web browser to authenticate
      // instead user will be prompted for face id and that will authenticate. If they don't elect for biometrics they won't be able to log in
    } catch (e) {
      console.error(e)
      toast.error(`Unknown error: ${e as Error}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  // check if user has previously enrolled biometrics and use them to authenticate
  useFocusEffect(() => {
    const authenticateWithBiometrics = async () => {
      setIsBiometricsAvailable(await checkIfBiometricsAvailable())
      if (isBiometricsAvailable) {
        const authenticatedViaBiometrics = await triggerLocalBiometrics()
        if (authenticatedViaBiometrics) {
          setIsAuthenticated(true)
        }
      }
    }

    if (!session) {
      console.log(
        "[login] user does not have a session, user must log in before biometrics can be used"
      )
    } else {
      void authenticateWithBiometrics()
    }
  })

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex flex-1 items-center justify-center gap-3">
          <Text className="text-4xl font-bold text-white">locutus</Text>
          <View className="flex flex-row gap-2 space-x-4">
            <Pressable
              onPress={handleSignIn}
              className="flex w-22 items-center justify-center rounded bg-emerald-300 p-2"
            >
              {loading ? (
                <Text className="text-xl font-bold text-black">Loading...</Text>
              ) : (
                <Text className="text-xl font-bold text-black">Login</Text>
              )}
            </Pressable>
          </View>
        </View>

        <Toaster />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
