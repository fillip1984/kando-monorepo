import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2"
import { expo } from "@better-auth/expo"
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth"
import { betterAuth } from "better-auth"
import { createAuthMiddleware } from "better-auth/api"
import { oAuthProxy } from "better-auth/plugins"

import { db } from "@kando/db/client"
import * as schema from "@kando/db/schema"

// TEMPORARY: logs the outcome of the mobile OAuth callback redirect to
// diagnose why the deep-link handoff isn't happening in production. Remove
// once the AWS/expo auth issue is root-caused.
const debugCallbackPlugin: BetterAuthPlugin = {
  id: "debug-oauth-callback",
  hooks: {
    before: [
      {
        matcher: (ctx) => ctx.path?.startsWith("/sign-in/social") ?? false,
        // eslint-disable-next-line @typescript-eslint/require-await
        handler: createAuthMiddleware(async (ctx) => {
          console.log("[auth-debug] sign-in/social request", {
            contentLength: ctx.request?.headers.get("content-length"),
            transferEncoding: ctx.request?.headers.get("transfer-encoding"),
            contentType: ctx.request?.headers.get("content-type"),
            body: JSON.stringify(ctx.body),
          })
        }),
      },
      {
        matcher: (ctx) =>
          ctx.path?.startsWith("/expo-authorization-proxy") ?? false,
        // eslint-disable-next-line @typescript-eslint/require-await
        handler: createAuthMiddleware(async (ctx) => {
          const authorizationURL = ctx.query?.authorizationURL as
            string | undefined
          console.log("[auth-debug] expo-authorization-proxy request", {
            rawRequestUrl: ctx.request?.url,
            oauthState: ctx.query?.oauthState as string | undefined,
            authorizationURL,
            hasState: authorizationURL
              ? new URL(authorizationURL).searchParams.has("state")
              : null,
          })
        }),
      },
    ],
    after: [
      {
        matcher: (ctx) => ctx.path?.startsWith("/callback") ?? false,
        // eslint-disable-next-line @typescript-eslint/require-await
        handler: createAuthMiddleware(async (ctx) => {
          const headers = ctx.context.responseHeaders
          console.log("[auth-debug] callback response", {
            path: ctx.path,
            location: headers?.get("location"),
            hasSetCookie: !!headers?.get("set-cookie"),
          })
        }),
      },
    ],
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
      oAuthProxy({
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      expo(),
      debugCallbackPlugin,
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
