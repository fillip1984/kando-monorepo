import "@/global.css"
import { authClient } from "@/utils/auth"
import { colors } from "@/utils/color-utils"
import { Lucide } from "@react-native-vector-icons/lucide"
import * as LocalAuthentication from "expo-local-authentication"
import { Stack } from "expo-router"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { toast, Toaster } from "sonner-native"

export default function RootLayout() {
  const { data: session } = authClient.useSession()
  console.log(session)
  if (session) {
    return <MainLayout />
  }

  return <Login />
}

const MainLayout = () => {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toaster />
    </GestureHandlerRootView>
  )
}

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [canLogInWithBiometrics, setCanLogInWithBiometrics] = useState(false)

  const requestAndAuthenticateViaBiometrics = async () => {
    const authenticated = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate with Face ID",
    })

    if (authenticated.success) {
      return true
    } else {
      console.warn(authenticated.error)
      return false
    }
  }

  //   const { logIn, logInWithBiometrics } = useSessionStore()

  const handleSignIn = async () => {
    try {
      setLoading(true)
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })
      //   const success = await logIn(serverUrl, username, password)
      //   if (!success) {
      //     toast.error("Invalid username or password")
      //   }
      // const bioAuthResult = await requestAndAuthenticateViaBiometrics();
      // if (bioAuthResult) {
      //   await logInWithBiometrics(bioAuthResult);
      // }
    } catch {
      toast.error("Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWithBiometrics = async () => {
    try {
      const bioAuthResult = await requestAndAuthenticateViaBiometrics()
      if (bioAuthResult) {
        // await logInWithBiometrics(bioAuthResult)
      }
    } catch {
      toast.error("Unknown error")
    }
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex flex-1 items-center justify-center">
          <Text className="text-4xl font-bold text-white">locutus</Text>
          <Pressable
            onPress={handleSignIn}
            className="rounded bg-emerald-300 p-2"
          >
            <Text className="text-lg text-black">Login</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLoginWithBiometrics}
          className={`rounded bg-slate-600 p-3 ${!canLogInWithBiometrics ? "opacity-50" : ""}`}
          disabled={!canLogInWithBiometrics}
        >
          <Lucide name="scan-face" size={42} color="white" />
        </Pressable>
        <Toaster />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
