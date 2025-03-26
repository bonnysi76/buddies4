"use client"

import { MessageSquare } from "lucide-react"
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
import { useRouter } from "next/navigation"

export function MessagesDropdown() {
  const router = useRouter()

  const messages = [
    {
      id: 1,
      name: "Sarah Chen",
      message: "Hey, did you finish the assignment?",
      time: "2m",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SC",
      unread: true,
    },
    {
      id: 2,
      name: "Michael Johnson",
      message: "Thanks for sharing your notes!",
      time: "1h",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MJ",
      unread: true,
    },
    {
      id: 3,
      name: "Emma Williams",
      message: "Are we still meeting at the library?",
      time: "3h",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EW",
      unread: false,
    },
  ]

  const handleViewMessage = (id: number) => {
    router.push(`/messages?id=${id}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          {messages.some((m) => m.unread) && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {messages.filter((m) => m.unread).length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {messages.map((message) => (
            <DropdownMenuItem
              key={message.id}
              className="flex gap-4 p-3 cursor-pointer"
              onClick={() => handleViewMessage(message.id)}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={message.avatar} alt="" />
                <AvatarFallback>{message.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{message.name}</p>
                  <p className="text-xs text-muted-foreground">{message.time}</p>
                </div>
                <p className="text-xs truncate">{message.message}</p>
              </div>
              {message.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" onClick={() => router.push("/messages")}>
          View all messages
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

