"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Notifications() {
  const [unreadCount, setUnreadCount] = useState(3)

  const notifications = [
    {
      id: 1,
      title: "New message from Sarah",
      description: "Hey, did you finish the assignment?",
      time: "2 minutes ago",
      read: false,
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SC",
    },
    {
      id: 2,
      title: "Michael commented on your post",
      description: "Great insights on the research paper!",
      time: "1 hour ago",
      read: false,
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MJ",
    },
    {
      id: 3,
      title: "New study group invitation",
      description: "Join 'Advanced Calculus Study Group'",
      time: "3 hours ago",
      read: false,
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SG",
    },
    {
      id: 4,
      title: "Your file was downloaded",
      description: "Physics Notes.pdf was downloaded 5 times",
      time: "Yesterday",
      read: true,
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "FD",
    },
  ]

  const markAllAsRead = () => {
    setUnreadCount(0)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex gap-4 p-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={notification.avatar} alt="" />
                <AvatarFallback>{notification.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

