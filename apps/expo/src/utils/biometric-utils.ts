import * as LocalAuthentication from "expo-local-authentication"

export const verifyLocalBiometrics = async () => {
  // 1. Verify device hardware supports biometrics
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) return false

  // 2. Check if the user has enrolled any fingerprints or facial scans
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  if (!isEnrolled) return false

  return true
}

export const triggerLocalBiometrics = async () => {
  // 3. Trigger the operating system biometric modal
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Unlock your account",
    fallbackLabel: "Use Device Passcode",
    disableDeviceFallback: false, // Fallback to PIN/Pattern if biometrics fail
  })

  return result.success
}
