"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/server/better-auth/client"
import { useState } from "react"

import googleIcon from "@/../public/icons/google-icon.svg"
import Image from "next/image"

export default function SignInView() {
  const socialProviders = [{ label: "google", icon: googleIcon }]

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  return (
    <div className="flex h-screen w-screen flex-col items-center pt-40">
      <div className="flex w-2/3 flex-col items-center justify-center gap-2">
        <h3 className="text-center text-2xl font-bold">Welcome to Todo</h3>
        <p className="text-sm text-muted-foreground">
          This web application is by invitation only...
        </p>
        <div className="mt-8">
          {socialProviders.map((provider) => (
            <Button
              key={provider.label}
              onClick={() =>
                authClient.signIn.social({
                  provider: provider.label,
                  fetchOptions: {
                    onRequest: () => {
                      setIsLoading(true)
                      setError("")
                    },
                    onError: () => {
                      setIsLoading(false)
                      setError("An error occurred during sign-in.")
                    },
                  },
                })
              }
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Image
                    src={provider.icon}
                    alt={provider.label}
                    width={20}
                    height={20}
                  />
                  {provider.label.charAt(0).toUpperCase() +
                    provider.label.slice(1)}
                </>
              )}
            </Button>
          ))}
        </div>
        {error && <p className="text-destructive">{error}</p>}
      </div>
    </div>
  )
}
