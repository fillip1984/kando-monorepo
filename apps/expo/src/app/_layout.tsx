import * as LocalAuthentication from "expo-local-authentication"
import { Stack } from "expo-router"
import { useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"

import { toast, Toaster } from "sonner-native"

import "@/styles.css"
import { authClient } from "@/utils/auth"
import { colors } from "@/utils/color-utils"
import { Text, View } from "react-native"

export default function RootLayout() {
  const { data: session } = authClient.useSession()
  console.log(session)
  // if (session?.user) {
  //   return <MainLayout />
  // }

  return <Login />
}

const MainLayout = () => {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen
          name="media/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="player/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen name="reader/[id]" options={{}} /> */}
      </Stack>
      <Toaster />
    </GestureHandlerRootView>
  )
}

const Login = () => {
  const [serverUrl, setServerUrl] = useState(
    process.env.EXPO_PUBLIC_AUDIOBOOK_SHELF_API_URL ?? ""
  )
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
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

  const handleLogin = async () => {
    try {
      if (!serverUrl || !username || !password) {
        toast.warning("Please fill in all fields")
        return
      }

      setLoading(true)
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
      if (!serverUrl) {
        toast.warning("Please set server url first")
        return
      }

      const bioAuthResult = await requestAndAuthenticateViaBiometrics()
      if (bioAuthResult) {
        // await logInWithBiometrics(bioAuthResult)
      }
    } catch {
      toast.error("Unknown error")
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View>
        <Text className="text-3xl text-red-500">locutus</Text>
      </View>
      {/* <View className="flex h-screen items-center gap-4 p-4">

          <View className="flex w-full gap-3">
            <View className="my-4 flex gap-3">
              <View className="flex w-full flex-row items-center gap-2">
                <Lucide name="user" size={32} color="white" />
                <TextInput
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                  placeholder="Username"
                  className="flex-1 rounded bg-white p-2 text-xl text-black"
                  autoCapitalize="none"
                />
              </View>

              <View className="flex w-full flex-row items-center gap-2">
                <Lucide name="key-round" size={32} color="white" />
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Password"
                  secureTextEntry
                  className="flex-1 rounded bg-white p-2 text-xl text-black"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="flex flex-row items-center gap-4">
              <Pressable
                onPress={handleLogin}
                className="flex flex-1 flex-row items-center justify-center gap-3 rounded bg-slate-600 px-4 py-2"
              >
                {loading && (
                  <View className="animate-spin">
                    <Lucide name="loader-circle" size={32} color="white" />
                  </View>
                )}
                <Text className="text-3xl text-white">Login</Text>
              </Pressable>

              <Pressable
                onPress={handleLoginWithBiometrics}
                className={`rounded bg-slate-600 p-3 ${!canLogInWithBiometrics ? "opacity-50" : ""}`}
                disabled={!canLogInWithBiometrics}
              >
                <Lucide name="scan-face" size={42} color="white" />
              </Pressable>
            </View>
          </View>
        </View> */}
      <Toaster />
    </SafeAreaView>
    // </GestureHandlerRootView>
  )
}
