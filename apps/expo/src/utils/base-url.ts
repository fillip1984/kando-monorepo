export const getBaseUrl = () => {
  // maybe use something like this: https://www.shipnative.dev/blog/expo-environment-variables
  // console.log("[base-url] from environment", process.env.SERVER_URL)
  const url = process.env.SERVER_URL ?? "https://kando.illizen.com"
  console.log("[base-url] using base url", url)
  return url
}
