export const getBaseUrl = () => {
  // maybe use something like this: https://www.shipnative.dev/blog/expo-environment-variables
  const url = process.env.EXPO_PUBLIC_SERVER_URL ?? "https://kando.illizen.com"
  return url
}

export const isServerReachable = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/health`)
    const healthStatus = (await response.json()) as { status: string }

    console.log("[health] server health check", healthStatus)

    return healthStatus.status === "ok"
  } catch (e) {
    console.error(e)
    return false
  }
}
