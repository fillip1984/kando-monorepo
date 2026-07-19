"use client"

import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"
import { useParams, usePathname } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"

export default function AppTopbar() {
  const id = useParams().id
  const path = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href: string }[]
  >([])
  const trpc = useTRPC()
  const { data: collection, isLoading } = useQuery(
    trpc.collection.readById.queryOptions(
      {
        id: id as string,
      },
      {
        enabled: !!id && path.startsWith("/collections"),
      }
    )
  )
  useEffect(() => {
    const segments = path.split("/").filter(Boolean)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBreadcrumbs(
      segments.map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: "/" + segments.slice(0, index + 1).join("/"),
      }))
    )
  }, [path])

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) =>
            // on last breadcrumb, render as page instead of link
            breadcrumbs.length === 1 || index < breadcrumbs.length - 1 ? (
              <Fragment key={breadcrumb.href}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={breadcrumb.href}>
                    {breadcrumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.length > 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            ) : (
              <BreadcrumbItem key={breadcrumb.href}>
                <BreadcrumbPage>
                  {isLoading ? "Loading..." : (collection?.name ?? "Not Found")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
