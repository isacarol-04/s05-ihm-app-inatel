import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

function Popover(props) {
  return <PopoverPrimitive.Root {...props} />
}

function PopoverTrigger(props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({ className, align = "end", side = "bottom", sideOffset = 12, ...props }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} collisionPadding={16} className="z-50">
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "flex max-h-[min(36rem,var(--available-height))] w-[26rem] max-w-[calc(100vw-2rem)] origin-[var(--transform-origin)] flex-col gap-4 rounded-3xl bg-popover p-5 text-popover-foreground shadow-lg ring-1 ring-border outline-none transition duration-200 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverTitle(props) {
  return <PopoverPrimitive.Title data-slot="popover-title" {...props} />
}

function PopoverDescription(props) {
  return <PopoverPrimitive.Description data-slot="popover-description" {...props} />
}

export { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger }
