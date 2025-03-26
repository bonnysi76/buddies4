"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { createPostFromForm } from "@/lib/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function CreatePost() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState<"public" | "friends" | "private">("public")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please enter some content for your post",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("content", content)
      formData.append("visibility", visibility)

      const result = await createPostFromForm(formData)

      if (result.success) {
        toast({
          title: "Post created",
          description: "Your post has been created successfully",
        })

        // Reset form
        setContent("")
      } else {
        toast({
          title: "Post failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Post failed",
        description: error instanceof Error ? error.message : "An error occurred while creating the post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const visibilityOptions = {
    public: { label: "Public", icon: Icons.globe },
    friends: { label: "Friends", icon: Icons.users },
    private: { label: "Only Me", icon: Icons.lock },
  }

  const VisibilityIcon = visibilityOptions[visibility].icon

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0"
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <VisibilityIcon className="h-4 w-4" />
                {visibilityOptions[visibility].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setVisibility("public")}>
                <Icons.globe className="mr-2 h-4 w-4" />
                <span>Public</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVisibility("friends")}>
                <Icons.users className="mr-2 h-4 w-4" />
                <span>Friends</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVisibility("private")}>
                <Icons.lock className="mr-2 h-4 w-4" />
                <span>Only Me</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

