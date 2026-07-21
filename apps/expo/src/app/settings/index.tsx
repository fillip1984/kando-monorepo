import { Text } from "expo-router/build/react-navigation"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SettingsScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text>Settings</Text>
      </View>
    </SafeAreaView>
  )
}
