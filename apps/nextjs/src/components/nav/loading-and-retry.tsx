import Link from "next/link"

import { TriangleAlertIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

export default function LoadingAndRetry({
  isLoading,
  isError,
  retry,
}: {
  isLoading: boolean
  isError: boolean
  retry: () => void
}) {
  return (
    <div className="mt-12 flex grow justify-center">
      {isLoading && <Spinner className="mx-auto h-24 w-24 text-primary" />}

      {isError && (
        <div className="flex flex-col gap-3">
          <h2 className="flex items-center justify-center gap-2 uppercase">
            <TriangleAlertIcon /> error
          </h2>
          <div className="flex flex-col items-center justify-center gap-2">
            <p>An error has occurred</p>
            <div className="flex gap-4">
              <Button
                variant={"default"}
                size={"lg"}
                onClick={retry}
                className="text-xl"
              >
                Retry
              </Button>
              <Link href="/">
                <Button variant={"secondary"} size={"lg"}>
                  Go home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
