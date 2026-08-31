import { useAppStore } from "@/stores/app-store"
import { Button, Form, Host, Section, Toggle } from "@expo/ui/swift-ui"
import { useState } from "react"

export default function SettingsScreen() {
  const { setIsAuthenticated } = useAppStore()
  const handleSignOut = async () => {
    await setIsAuthenticated(false)
  }

  const [notifications, setNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Preferences">
          <Toggle
            label="Enable notifications"
            isOn={notifications}
            onIsOnChange={setNotifications}
          />
          <Toggle
            label="Dark mode"
            isOn={darkMode}
            onIsOnChange={setDarkMode}
          />
        </Section>

        <Section>
          <Button
            label="Sign out"
            systemImage="iphone.and.arrow.forward.outward"
            onPress={handleSignOut}
          />
        </Section>
      </Form>
    </Host>
  )
}
