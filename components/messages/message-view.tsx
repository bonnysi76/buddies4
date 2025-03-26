"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { VoiceRecorder } from "@/components/messages/voice-recorder"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: number
  content: string
  sender: "me" | "other"
  timestamp: string
  type: "text" | "voice"
  duration?: number
  isPlaying?: boolean
}

export function MessageView() {
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hey, did you finish the assignment?",
      sender: "other",
      timestamp: "2:30 PM",
      type: "text",
    },
    {
      id: 2,
      content: "Not yet, I'm still working on the last problem. How about you?",
      sender: "me",
      timestamp: "2:32 PM",
      type: "text",
    },
    {
      id: 3,
      content: "I'm stuck on problem 3. Could you help me with it?",
      sender: "other",
      timestamp: "2:33 PM",
      type: "text",
    },
    {
      id: 4,
      content: "/voice-message-1.mp3",
      sender: "me",
      timestamp: "2:35 PM",
      type: "voice",
      duration: 8,
      isPlaying: false,
    },
    {
      id: 5,
      content: "Sounds good! See you there.",
      sender: "other",
      timestamp: "2:36 PM",
      type: "text",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (Math.random() > 0.7) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 3000)
      }
    }, 5000)

    return () => clearTimeout(typingTimeout)
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate reply after a delay
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setIsTyping(true)

        setTimeout(() => {
          setIsTyping(false)

          const reply: Message = {
            id: messages.length + 2,
            content: "Thanks for letting me know!",
            sender: "other",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "text",
          }

          setMessages((prev) => [...prev, reply])
        }, 2000)
      }, 1000)
    }
  }

  const handleVoiceMessageComplete = (duration: number) => {
    const voiceMessage: Message = {
      id: messages.length + 1,
      content: `/voice-message-${messages.length}.mp3`,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "voice",
      duration,
      isPlaying: false,
    }

    setMessages([...messages, voiceMessage])

    toast({
      title: "Voice message sent",
      description: `Your ${duration} second voice message has been sent.`,
    })
  }

  const toggleVoiceMessagePlayback = (id: number) => {
    setMessages(
      messages.map((message) => {
        if (message.id === id) {
          return { ...message, isPlaying: !message.isPlaying }
        } else if (message.type === "voice" && message.isPlaying) {
          // Stop any other playing voice messages
          return { ...message, isPlaying: false }
        }
        return message
      }),
    )

    // Simulate playback ending
    const message = messages.find((m) => m.id === id)
    if (message?.type === "voice" && !message.isPlaying && message.duration) {
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isPlaying: false } : m)))
      }, message.duration * 1000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Chen" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Sarah Chen</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="transition-all duration-200 hover:bg-primary/10">
            <Icons.phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="transition-all duration-200 hover:bg-primary/10">
            <Icons.video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.moreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Block user</DropdownMenuItem>
              <DropdownMenuItem>Clear chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.type === "text" ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-background/20"
                      onClick={() => toggleVoiceMessagePlayback(message.id)}
                    >
                      {message.isPlaying ? <Icons.pause className="h-4 w-4" /> : <Icons.play className="h-4 w-4" />}
                    </Button>
                    <div className="flex-1">
                      <div className="h-1 bg-background/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-background/50 transition-all duration-100 ${
                            message.isPlaying ? "animate-progress" : ""
                          }`}
                          style={{
                            width: message.isPlaying ? "100%" : "0%",
                            animationDuration: `${message.duration}s`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs">{message.duration}s</span>
                  </div>
                )}
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t">
        {isRecording ? (
          <VoiceRecorder onComplete={handleVoiceMessageComplete} onCancel={() => setIsRecording(false)} />
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsRecording(true)}>
              <Icons.mic className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              className="min-h-[44px]"
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="transition-all duration-200 hover:scale-[1.05]"
            >
              <Icons.send className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

