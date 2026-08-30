import type { ConfigContext, ExpoConfig } from "expo/config"

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "kando",
  slug: "kando",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  owner: "fillip1984",
  icon: "./assets/kando-logo.png",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.illizen.kando",
    supportsTablet: true,
    icon: {
      light: "./assets/kando-logo.png",
      dark: "./assets/kando-logo.png",
    },
  },
  android: {
    package: "com.illizen.kando",
    adaptiveIcon: {
      foregroundImage: "./assets/kando-logo.png",
      backgroundColor: "#1F104A",
    },
  },
  extra: {
    eas: {
      projectId: "b3c31a4c-fd20-447c-acf6-1ba0c58eb339",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    reactCanary: true,
    reactCompiler: true,
  },
  plugins: [
    "@react-native-vector-icons/lucide",
    [
      "expo-local-authentication",
      { faceIDPermission: "Allow $(PRODUCT_NAME) to use Face ID" },
    ],
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#E4E4E7",
        image: "./assets/kando-logo.png",
        dark: {
          backgroundColor: "#18181B",
          image: "./assets/kando-logo.png",
        },
      },
    ],
  ],
})
