"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { BuddiesLogo } from "@/components/buddies-logo"

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/feed",
      label: "Feed",
      active: pathname === "/feed",
      icon: <Icons.home className="h-4 w-4 mr-2" />,
    },
    {
      href: "/messages",
      label: "Messages",
      active: pathname === "/messages",
      icon: <Icons.message className="h-4 w-4 mr-2" />,
    },
    {
      href: "/files",
      label: "Files",
      active: pathname === "/files",
      icon: <Icons.file className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="flex items-center">
      <Link href="/feed" className="mr-6 flex items-center space-x-2">
        <BuddiesLogo textClassName="text-xl" />
      </Link>
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Button key={route.href} asChild variant={route.active ? "default" : "ghost"} size="sm">
            <Link
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors",
                route.active ? "text-primary-foreground" : "text-muted-foreground hover:text-primary",
              )}
            >
              {route.label}
            </Link>
          </Button>
        ))}
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open Menu">
            <Icons.menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex items-center mb-6">
            <BuddiesLogo textClassName="text-xl" />
          </div>
          <nav className="flex flex-col gap-4">
            {routes.map((route) => (
              <Button
                key={route.href}
                asChild
                variant={route.active ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setOpen(false)}
              >
                <Link href={route.href}>
                  {route.icon}
                  {route.label}
                </Link>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

