import { authClient } from "@/utils/auth"
import { Text } from "expo-router/build/react-navigation"
import { Pressable, View } from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"

export default function SettingsScreen() {
  const handleSignOut = async () => {
    await authClient.signOut()
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Settings</Text>
        <Pressable
          onPress={handleSignOut}
          className="rounded bg-emerald-300 p-2"
        >
          <Text className="text-lg text-black">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
