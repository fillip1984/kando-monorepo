import "server-only"

import { nextCookies } from "better-auth/next-js"
import { headers } from "next/headers"
import { cache } from "react"

import { initAuth } from "@kando/auth"

import { env } from "@/env"

export const auth = initAuth({
  baseUrl: env.SERVER_URL,
  productionUrl: env.SERVER_URL,
  disableSignUps: env.AUTH_DISABLE_SIGN_UPS,
  secret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
  extraPlugins: [nextCookies()],
})

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
)
