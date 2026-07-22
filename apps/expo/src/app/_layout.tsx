import "@/global.css"
import { authClient } from "@/utils/auth"
import { triggerLocalBiometrics } from "@/utils/biometric-utils"
import { colors } from "@/utils/color-utils"
import { Lucide } from "@react-native-vector-icons/lucide"
import * as LocalAuthentication from "expo-local-authentication"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { Pressable, Text, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { toast, Toaster } from "sonner-native"

export default function RootLayout() {
  const [biometricsAvailable, setBiometricsAvailable] = useState(false)
  useEffect(() => {
    const checkBiometrics = async () => {
      const canUseBiometrics =
        (await LocalAuthentication.hasHardwareAsync()) &&
        (await LocalAuthentication.isEnrolledAsync())
      setBiometricsAvailable(canUseBiometrics)
    }
    checkBiometrics()
  }, [])

  useEffect(() => {
    const checkAppAccess = async () => {
      // Better Auth checks if a session token natively exists in Expo SecureStore
      const { data: session } = await authClient.getSession()

      if (session) {
        // User is logged into Better Auth server, but we gate the UI with local biometrics
        const localized = await triggerLocalBiometrics()
        // if (localized) {

        // }
      } else {
        // No active server session found; push to primary authentication screen
        // router.replace("/login")
      }
    }
    checkAppAccess()
  }, [])

  const { data: session } = authClient.useSession()
  console.log(session)
  if (session) {
    return <MainLayout />
  }

  return <Login biometricsAvailable={biometricsAvailable} />
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

const Login = ({ biometricsAvailable }: { biometricsAvailable: boolean }) => {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setLoading(true)
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })
    } catch (e) {
      console.error(e)
      toast.error("Unknown error")
    } finally {
      setLoading(false)
    }
  }

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
              <Text className="text-xl font-bold text-black">Login</Text>
            </Pressable>
            <Pressable
              onPress={triggerLocalBiometrics}
              className={`rounded bg-slate-600 p-3 ${!biometricsAvailable ? "opacity-50" : ""}`}
              disabled={!biometricsAvailable}
            >
              <Lucide name="scan-face" size={42} color="white" />
            </Pressable>
          </View>
        </View>

        <Toaster />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
