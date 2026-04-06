import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "block text-[10px] font-semibold uppercase tracking-wide text-[#C6C6CB] mb-2",
        className
      )}
      {...props}
    />
  )
}

export { Label }