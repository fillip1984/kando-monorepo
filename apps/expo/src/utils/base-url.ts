import Constants from "expo-constants"

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const debuggerHost = Constants.expoConfig?.hostUri
  const localhost = debuggerHost?.split(":")[0]

  // console.log("localhost:", localhost) <-- this comes out as 192.168.68.62 or whatever the laptop ip is
  // if (!localhost) {
  //   throw new Error(
  //     "Failed to get localhost. Please point to your production server."
  //   )
  // }
  // return `http://${localhost}:3000`

  // TODO: we could grab the ip address of the debuggerHost but better-auth doesn't play nicely with it...
  // or google doesn't like that we're using a url that doesn't match a registered oauth redirect url
  const baseUrl = !localhost
    ? "https://kando.illizen.com"
    : "http://localhost:3000"
  return baseUrl
}
