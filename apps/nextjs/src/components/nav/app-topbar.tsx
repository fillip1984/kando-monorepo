"use client"

import NewTaskForm from "@/app/boards/swimlane/task/new-task-form"
import { TaskDialog } from "@/app/boards/swimlane/task/task-dialog"
import { useTRPC } from "@/trpc/react"
import type { TaskType } from "@kando/api"
import { useQuery } from "@tanstack/react-query"
import { SearchIcon } from "lucide-react"
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
import { Button } from "../ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"

export default function AppTopbar() {
  const id = useParams().id
  const path = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href: string }[]
  >([])

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
                  {/* {isLoading ? "Loading..." : (collection?.name ?? "Not Found")} */}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto">
        <SearchCommand />
      </div>
    </header>
  )
}

const SearchCommand = () => {
  const commonCommands = [
    {
      title: "New Task",
      action: () => {
        setIsNewTaskDialogOpen(true)
        setCommandAndSearchOpen(false)
      },
    },
  ]
  const [commandAndSearchOpen, setCommandAndSearchOpen] = useState(false)

  const [commandOrSearch, setCommandOrSearch] = useState("")
  useEffect(() => {
    setCommandOrSearch("")
  }, [commandAndSearchOpen])

  // search form and results
  const trpc = useTRPC()
  const { data: tasks } = useQuery(trpc.tasks.readAll.queryOptions())
  const [searchTaskResults, setSearchTaskResults] = useState<TaskType[]>([])
  const [searchCommandResults, setSearchCommandResults] =
    useState<{ title: string; action: () => void }[]>(commonCommands)
  useEffect(() => {
    const debouncedSearch = setTimeout(async function search() {
      // debounce commandOrSearch for 300 ms and then update the search results
      if (!commandOrSearch) {
        setSearchTaskResults([])
        setSearchCommandResults(commonCommands)
        return
      } else {
        const x =
          tasks?.filter((task) =>
            task.title
              .toLocaleLowerCase()
              .includes(commandOrSearch.toLocaleLowerCase())
          ) ?? []
        setSearchTaskResults(x)
        setSearchCommandResults(
          commonCommands.filter((command) =>
            command.title
              .toLocaleLowerCase()
              .includes(commandOrSearch.toLocaleLowerCase())
          )
        )
      }
    }, 300)
    return () => clearTimeout(debouncedSearch)
  }, [commandOrSearch])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if 'k' is pressed alongside Cmd (Mac) or Ctrl (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault() // Stop default browser search bar from opening
        setCommandAndSearchOpen((prev) => !prev)
      }
    }

    // Attach listener to the window
    window.addEventListener("keydown", handleKeyDown)

    // Clean up listener on component unmount to prevent memory leaks
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // state for task dialog and selected task
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskType | undefined>(
    undefined
  )

  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setCommandAndSearchOpen(true)}
        className="bg-muted text-muted-foreground"
      >
        <SearchIcon className="size-4" />
        <span className="">⌘k</span>
      </Button>
      <CommandDialog
        open={commandAndSearchOpen}
        onOpenChange={setCommandAndSearchOpen}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type a command or search..."
            value={commandOrSearch}
            onValueChange={setCommandOrSearch}
          />
          <CommandList>
            <CommandEmpty>No commands or tasks found.</CommandEmpty>

            {searchTaskResults.length > 0 && (
              <CommandGroup heading="Tasks">
                {searchTaskResults.map((task) => (
                  <CommandItem
                    key={task.id}
                    onSelect={() => {
                      setSelectedTask(task)
                      setCommandAndSearchOpen(false)
                      setIsTaskDialogOpen(true)
                    }}
                  >
                    {task.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchCommandResults.length > 0 && (
              <CommandGroup heading="Common Commands">
                {searchCommandResults.map((command) => (
                  <CommandItem key={command.title} onSelect={command.action}>
                    {command.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          open={isTaskDialogOpen}
          close={() => setIsTaskDialogOpen(false)}
        />
      )}

      {isNewTaskDialogOpen && (
        <NewTaskForm
          open={isNewTaskDialogOpen}
          close={() => setIsNewTaskDialogOpen(false)}
        />
      )}
    </>
  )
}
