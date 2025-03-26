"use client"

import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function UserProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const isLoading = status === "loading"

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/auth/signin")
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <Icons.spinner className="h-4 w-4 animate-spin" />
          </AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  if (!session?.user) {
    return (
      <Button variant="outline" size="sm" onClick={() => router.push("/auth/signin")}>
        Sign In
      </Button>
    )
  }

  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user.image || "/placeholder.svg?height=32&width=32"}
              alt={session.user.name || "User"}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <Icons.user className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Icons.settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

