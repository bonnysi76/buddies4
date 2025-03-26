"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"

export function SideNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/feed",
      label: "Feed",
      icon: <Icons.home className="mr-2 h-4 w-4" />,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <Icons.message className="mr-2 h-4 w-4" />,
    },
    {
      href: "/files",
      label: "Files",
      icon: <Icons.file className="mr-2 h-4 w-4" />,
    },
    {
      href: "/groups",
      label: "Groups",
      icon: <Icons.users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/events",
      label: "Events",
      icon: <Icons.calendar className="mr-2 h-4 w-4" />,
    },
    {
      href: "/bookmarks",
      label: "Bookmarks",
      icon: <Icons.bookmark className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <ScrollArea className="h-full py-6">
      <div className="space-y-1 px-2">
        {routes.map((route) => (
          <Button
            key={route.href}
            asChild
            variant={pathname === route.href ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Link
              href={route.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                pathname === route.href ? "text-primary-foreground" : "text-muted-foreground hover:text-primary",
              )}
            >
              {route.icon}
              <span>{route.label}</span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="mt-6 px-3">
        <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Trending Topics</h3>
        <div className="space-y-1">
          {["#MachineLearning", "#StudyTips", "#Internships", "#ResearchPapers", "#CampusLife"].map((topic) => (
            <Button key={topic} variant="ghost" className="w-full justify-start text-xs">
              <Link href={`/topic/${topic.substring(1)}`} className="flex items-center">
                <span>{topic}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

