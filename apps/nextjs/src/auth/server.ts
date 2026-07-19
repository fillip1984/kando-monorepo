import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";

import { initAuth } from "@kando/auth";

import { env } from "~/env";

const baseUrl =
  env.NODE_ENV === "production" && env.PRODUCTION_URL
    ? env.PRODUCTION_URL
    : "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  productionUrl: env.PRODUCTION_URL,
  secret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
  extraPlugins: [nextCookies()],
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
