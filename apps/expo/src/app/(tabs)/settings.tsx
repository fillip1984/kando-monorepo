import { authClient } from "@/utils/auth"
import {
  Button,
  Form,
  Host,
  Section,
  TextField,
  Toggle,
} from "@expo/ui/swift-ui"
import { useState } from "react"

export default function SettingsScreen() {
  const handleSignOut = async () => {
    await authClient.signOut()
  }

  const [notifications, setNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Profile">
          <TextField placeholder="Name" />
          <TextField placeholder="Email" />
        </Section>

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
          <Button label="Save Changes" onPress={() => console.log("Saved!")} />
        </Section>
      </Form>
    </Host>
  )
}
