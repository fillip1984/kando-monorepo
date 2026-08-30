import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2"
import { expo } from "@better-auth/expo"
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth"
import { betterAuth } from "better-auth"
import { oAuthProxy } from "better-auth/plugins"

import { db } from "@kando/db/client"
import * as schema from "@kando/db/schema"

// The Expo client embeds the full Google authorization URL as a single query
// param (`authorizationURL=<percent-encoded-url>`) on the `/expo-authorization-proxy`
// request. Somewhere between the native client and this server, the encoding
// of that nested URL's own `&`/`=` separators gets lost, so the URL arrives
// split across multiple top-level query params instead of one encoded value
// (only reproduces once deployed - see notes in PR/issue tracker). This
// reassembles the original authorizationURL from those stray params before
// better-auth's router parses the query string.
const repairMangledExpoProxyUrl: BetterAuthPlugin = {
  id: "repair-mangled-expo-proxy-url",
  // eslint-disable-next-line @typescript-eslint/require-await
  onRequest: async (request) => {
    const url = new URL(request.url)
    if (!url.pathname.endsWith("/expo-authorization-proxy")) return

    const rawQuery = url.search.slice(1)
    const marker = "authorizationURL="
    const markerIndex = rawQuery.indexOf(marker)
    const hasExtraParams = [...url.searchParams.keys()].some(
      (key) => key !== "authorizationURL" && key !== "oauthState"
    )
    if (markerIndex === -1 || !hasExtraParams) return

    const afterMarker = rawQuery.slice(markerIndex + marker.length)
    const oauthStateMarker = "&oauthState="
    const oauthStateIndex = afterMarker.lastIndexOf(oauthStateMarker)
    const authorizationPart =
      oauthStateIndex === -1
        ? afterMarker
        : afterMarker.slice(0, oauthStateIndex)
    const oauthStateRaw =
      oauthStateIndex === -1
        ? null
        : afterMarker.slice(oauthStateIndex + oauthStateMarker.length)

    // Only the leading segment (up to the first literal "&") was still
    // percent-encoded; everything after it are the nested URL's own params.
    const firstAmpIndex = authorizationPart.indexOf("&")
    const encodedPrefix =
      firstAmpIndex === -1
        ? authorizationPart
        : authorizationPart.slice(0, firstAmpIndex)
    const literalRemainder =
      firstAmpIndex === -1 ? "" : authorizationPart.slice(firstAmpIndex)
    const repairedAuthorizationURL =
      decodeURIComponent(encodedPrefix) + literalRemainder

    const repairedUrl = new URL(url.toString())
    repairedUrl.search = ""
    repairedUrl.searchParams.set("authorizationURL", repairedAuthorizationURL)
    if (oauthStateRaw) {
      repairedUrl.searchParams.set(
        "oauthState",
        decodeURIComponent(oauthStateRaw)
      )
    }

    console.log("[auth] repaired mangled expo-authorization-proxy url", {
      before: request.url,
      after: repairedUrl.toString(),
    })
    return { request: new Request(repairedUrl, request) }
  },
}

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseUrl: string
  productionUrl: string
  secret: string | undefined

  disableSignUps: boolean

  googleClientId: string
  googleClientSecret: string
  extraPlugins?: TExtraPlugins
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      repairMangledExpoProxyUrl,
      oAuthProxy({
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
        disableImplicitSignUp: options.disableSignUps,
        redirectURI: `${options.baseUrl}/api/auth/callback/google`,
      },
    },
    trustedOrigins: ["kando://", "expo://"],
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx)
      },
    },
  } satisfies BetterAuthOptions

  return betterAuth(config)
}

export type Auth = ReturnType<typeof initAuth>
export type Session = Auth["$Infer"]["Session"]
