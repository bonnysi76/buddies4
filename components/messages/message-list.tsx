"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"

interface Contact {
  id: number
  name: string
  avatar: string
  initials: string
  lastMessage: string
  time: string
  unread: boolean
  online: boolean
}

export function MessageList() {
  const [search, setSearch] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SC",
      lastMessage: "Hey, did you finish the assignment?",
      time: "2m",
      unread: true,
      online: true,
    },
    {
      id: 2,
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MJ",
      lastMessage: "Thanks for sharing your notes!",
      time: "1h",
      unread: true,
      online: true,
    },
    {
      id: 3,
      name: "Emma Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EW",
      lastMessage: "Are we still meeting at the library?",
      time: "3h",
      unread: false,
      online: false,
    },
    {
      id: 4,
      name: "David Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DL",
      lastMessage: "I'll send you the study guide later.",
      time: "1d",
      unread: false,
      online: false,
    },
    {
      id: 5,
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
      lastMessage: "Did you see the announcement about the exam?",
      time: "2d",
      unread: false,
      online: true,
    },
  ])
  const [activeContact, setActiveContact] = useState<number | null>(1)

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredContacts.map((contact) => (
            <Button
              key={contact.id}
              variant="ghost"
              className={`w-full justify-start px-2 py-3 h-auto ${activeContact === contact.id ? "bg-muted" : ""}`}
              onClick={() => setActiveContact(contact.id)}
            >
              <div className="flex items-center w-full gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.initials}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 text-left space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.time}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button className="w-full">
          <Icons.plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>
    </div>
  )
}

