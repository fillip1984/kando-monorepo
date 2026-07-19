import { Geist, Geist_Mono, Noto_Sans } from "next/font/google"

import { getSession } from "@/auth/server"
import { AppSidebar } from "@/components/nav/app-sidebar"
import AppTopbar from "@/components/nav/app-topbar"
import SignInView from "@/components/nav/sign-in"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { TRPCReactProvider } from "@/trpc/react"
import type { Metadata } from "next"
import "./globals.css"

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Stamina",
  description:
    "Productivity app to help you build good habits and get things done",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        notoSansHeading.variable
      )}
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider>
            {session?.user ? <SignedIn>{children}</SignedIn> : <SignInView />}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}

const SignedIn = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        <AppTopbar />
        <div className="flex grow overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
