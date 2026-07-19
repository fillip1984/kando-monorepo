import Link from "next/link"

import Container from "@/components/custom-ui/container"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export default function NotFound() {
  return (
    <Container>
      <div className="mt-12 flex flex-col items-center gap-4">
        <h4>Page not found</h4>
        <Link href="/">
          <Button>
            <HomeIcon /> Go home
          </Button>
        </Link>
      </div>
    </Container>
  )
}
