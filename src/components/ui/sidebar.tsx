

"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SidebarContext = React.createContext<{
  isCollapsed: boolean
  isInside: boolean
} | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within a Sidebar")
  return context
}

type SidebarProps = React.ComponentProps<"aside"> & {
  collapsible?: "icon" | "button"
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

function Sidebar({
  className,
  collapsible = "button",
  collapsed: controlledCollapsed,
  onCollapsedChange,
  children,
  ...props
}: SidebarProps) {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = React.useState(false)
  const isCollapsed = controlledCollapsed ?? uncontrolledCollapsed

  const handleToggle = () => {
    if (controlledCollapsed === undefined) {
      setUncontrolledCollapsed((prev) => !prev)
    }
    onCollapsedChange?.(!isCollapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, isInside: true }}>
      <TooltipProvider>
        <aside
          className={cn(
            "group/sidebar relative flex shrink-0 flex-col justify-between overflow-y-auto duration-300 ease-in-out",
            isCollapsed ? "items-center px-2 py-4" : "w-56 px-4 py-4",
            className
          )}
          {...props}
        >
          {children}
          {collapsible === "button" && (
            <SidebarTrigger
              className={cn(
                "absolute -right-3 top-1/2",
                isCollapsed && "rotate-180"
              )}
              onClick={handleToggle}
            />
          )}
        </aside>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-12 shrink-0 items-center",
        !isCollapsed && "gap-2 px-2",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-1 flex-col overflow-hidden",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full justify-start",
        isCollapsed && "justify-center",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

type SidebarMenuButtonProps = Omit<ButtonProps, "children"> & {
  children: React.ReactNode | ((isCollapsed: boolean) => React.ReactNode)
  asChild?: boolean
  tooltip?: React.ReactNode
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    { className, variant = "ghost", asChild, tooltip, isActive, children, ...props },
    ref
  ) => {
    const { isCollapsed } = useSidebar()
    const Comp = asChild ? "div" : "button"

    const renderedChild = typeof children === "function" ? children(isCollapsed) : children

    const button = (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          "h-auto w-full justify-start whitespace-nowrap px-3 py-2 text-left text-base",
          isCollapsed ? "min-h-12 w-12 justify-center" : "gap-4",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          className
        )}
        {...props}
        asChild={asChild}
      >
        {renderedChild}
      </Button>
    )

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right">{tooltip}</TooltipContent>
        </Tooltip>
      )
    }

    return button
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full items-center pl-3 pr-2 transition-all duration-300 ease-in-out",
        isCollapsed && "w-0 p-0",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-6 w-6 items-center justify-center rounded-full bg-border text-foreground transition-transform duration-300 ease-in-out",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Toggle Sidebar</span>
  </button>
))
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarProvider = SidebarContext.Provider

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
}
