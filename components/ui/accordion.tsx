"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
  value?: string | string[]
  onValueChange?: (value: string) => void
  type?: "single" | "multiple"
}>({})

function Accordion({
  children,
  className,
  type = "single",
  defaultValue,
  collapsible = false,
  ...props
}: React.ComponentProps<"div"> & {
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  collapsible?: boolean
}) {
  const [value, setValue] = React.useState<string | string[]>(
    defaultValue || (type === "multiple" ? [] : "")
  )

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      setValue((prev) => {
        if (type === "multiple") {
          const prevArray = Array.isArray(prev) ? prev : []
          return prevArray.includes(itemValue)
            ? prevArray.filter((v) => v !== itemValue)
            : [...prevArray, itemValue]
        }
        // type === 'single'
        return prev === itemValue && collapsible ? "" : itemValue
      })
    },
    [type, collapsible]
  )

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
      <div data-slot="accordion" className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const context = React.useContext(AccordionContext)
  const isOpen = Array.isArray(context.value)
    ? context.value.includes(value)
    : context.value === value

  return (
    <div
      data-slot="accordion-item"
      data-state={isOpen ? "open" : "closed"}
      className={cn("border-b last:border-b-0", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value })
        }
        return child
      })}
    </div>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { value?: string }) {
  const context = React.useContext(AccordionContext)
  // Value prop is injected by AccordionItem cloning, or passed manually
  const itemValue = (props as any).value

  const isOpen = Array.isArray(context.value)
    ? context.value.includes(itemValue)
    : context.value === itemValue

  const handleClick = () => {
    if (context.onValueChange && itemValue) {
      context.onValueChange(itemValue)
    }
  }

  return (
    <div className="flex">
      <button
        data-slot="accordion-trigger"
        data-state={isOpen ? "open" : "closed"}
        onClick={handleClick}
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { value?: string }) {
  const context = React.useContext(AccordionContext)
  const itemValue = (props as any).value
  const isOpen = Array.isArray(context.value)
    ? context.value.includes(itemValue)
    : context.value === itemValue

  if (!isOpen) return null;

  return (
    <div
      data-slot="accordion-content"
      data-state={isOpen ? "open" : "closed"}
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
