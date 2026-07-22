// Learn more: https://docs.expo.dev/guides/monorepos/
const path = require("node:path")
const { getDefaultConfig } = require("expo/metro-config")
const { FileStore } = require("metro-cache")
const { withUniwindConfig } = require("uniwind/metro")
const config = getDefaultConfig(__dirname)

config.cacheStores = [
  new FileStore({
    root: path.join(__dirname, "node_modules", ".cache", "metro"),
  }),
]

/** @type {import('expo/metro-config').MetroConfig} */
module.exports = withUniwindConfig(config, {
  // relative path to your global.css file (from previous step)
  cssEntryFile: "./src/global.css",
  // (optional) path where we gonna auto-generate typings
  // defaults to project's root
  dtsFile: "./src/uniwind-types.d.ts",
})
