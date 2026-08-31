export const getBaseUrl = () => {
  // maybe use something like this: https://www.shipnative.dev/blog/expo-environment-variables
  // console.log("[base-url] from environment", process.env.SERVER_URL)
  const url = process.env.SERVER_URL ?? "https://kando.illizen.com"
  console.log("[base-url] using base url", url)
  return url
}

export const healthCheck = () => {
  // TODO: checking if server is reachable
  try {
    fetch(`${getBaseUrl()}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        console.log("[health] server health check", data)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.status !== "ok") {
          // toast.error("Server is unreachable")
        }
      })
      .catch((err) => {
        console.error(err)
        // toast.error("Server is unreachable")
      })
  } catch (e) {
    console.error(e)
    // toast.error("Server is unreachable")
  }
}
