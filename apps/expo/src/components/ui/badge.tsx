import { cn } from "@/utils/ui-utils"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import type { ViewProps } from "react-native"
import { View } from "react-native"

const badgeVariants = cva(
  "h-5 w-fit shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 whitespace-nowrap transition-all focus-visible:ring-[3px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive/10 text-destructive dark:bg-destructive/20",
        outline: "border-border text-foreground",
        link: "text-primary underline-offset-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {
  children: React.ReactNode[]
}

function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      {children}
    </View>
  )
}

export { Badge, badgeVariants }
