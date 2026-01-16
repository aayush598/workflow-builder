"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface SelectContextType {
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  items: Map<string, React.ReactNode>
  registerItem: (value: string, children: React.ReactNode) => void
  unregisterItem: (value: string) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlledOpen = controlledOpen !== undefined
  const open = isControlledOpen ? controlledOpen : uncontrolledOpen
  const setOpen = React.useCallback((newOpen: boolean) => {
    if (!isControlledOpen) setUncontrolledOpen(newOpen)
    if (onOpenChange) onOpenChange(newOpen)
  }, [isControlledOpen, onOpenChange])

  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "")
  const isControlledValue = value !== undefined
  const currentValue = isControlledValue ? value : uncontrolledValue
  const handleValueChange = React.useCallback((newValue: string) => {
    if (!isControlledValue) setUncontrolledValue(newValue)
    if (onValueChange) onValueChange(newValue)
    setOpen(false)
  }, [isControlledValue, onValueChange, setOpen])

  const triggerRef = React.useRef<HTMLButtonElement>(null)

  // Registry for labels
  const [items] = React.useState(() => new Map<string, React.ReactNode>())
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  const registerItem = React.useCallback((val: string, label: React.ReactNode) => {
    items.set(val, label)
    forceUpdate()
  }, [items])

  const unregisterItem = React.useCallback((val: string) => {
    items.delete(val)
  }, [items])

  return (
    <SelectContext.Provider value={{
      value: currentValue,
      onValueChange: handleValueChange,
      open,
      setOpen,
      triggerRef,
      items,
      registerItem,
      unregisterItem
    }}>
      <div data-slot="select" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectGroup({
  children,
  ...props
}: React.ComponentProps<"div">) {
  return <div data-slot="select-group" {...props}>{children}</div>
}

function SelectValue({
  placeholder,
  ...props
}: React.ComponentProps<"span"> & { placeholder?: React.ReactNode }) {
  const context = React.useContext(SelectContext)
  if (!context) return null
  const { value, items } = context

  const label = (value && items.get(value)) || value || placeholder

  return (
    <span data-slot="select-value" {...props}>
      {label}
    </span>
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<"button"> & {
  size?: "sm" | "default"
}) {
  const context = React.useContext(SelectContext)

  return (
    <button
      data-slot="select-trigger"
      data-size={size}
      ref={context?.triggerRef}
      onClick={() => context?.setOpen(!context.open)}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 opacity-50" />
    </button>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<"div"> & {
  position?: "item-aligned" | "popper"
  align?: "center" | "start" | "end"
}) {
  const context = React.useContext(SelectContext)
  const [style, setStyle] = React.useState<React.CSSProperties>({})

  // Simple positioning logic
  React.useEffect(() => {
    if (context?.open && context.triggerRef.current) {
      const rect = context.triggerRef.current.getBoundingClientRect()
      // Default to below
      setStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 50
      })
    }
  }, [context?.open])

  if (!context?.open) return null

  return createPortal(
    <div
      data-slot="select-content"
      style={style}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md",
        className
      )}
      {...props}
    >
      <div className="p-1">
        {children}
      </div>
    </div>,
    document.body
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const context = React.useContext(SelectContext)
  const isSelected = context?.value === value

  // Register item label
  React.useEffect(() => {
    context?.registerItem(value, children)
    return () => context?.unregisterItem(value)
    // eslint-disable-next-line
  }, []) // Register once

  return (
    <div
      data-slot="select-item"
      onClick={() => context?.onValueChange?.(value)}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        {isSelected && <CheckIcon className="size-4" />}
      </span>
      <span>{children}</span>
    </div>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </div>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
