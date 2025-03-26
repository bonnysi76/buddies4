"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { createPostFromForm } from "@/lib/actions"

export function CreatePostCard() {
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("content", content)
      if (imageUrl) {
        formData.append("image", imageUrl)
      }

      await createPostFromForm(formData)

      setContent("")
      setImageUrl(null)

      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate image upload
  const handleImageUpload = () => {
    setIsLoading(true)

    // Simulate upload delay
    setTimeout(() => {
      setImageUrl("/placeholder.svg?height=400&width=600")
      setIsLoading(false)

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully!",
      })
    }, 1500)
  }

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's on your mind?"
            className="flex-1 resize-none bg-background"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {imageUrl && (
          <div className="mt-4 relative">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Post preview"
              className="w-full rounded-md object-cover max-h-[300px]"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
              onClick={() => setImageUrl(null)}
            >
              <Icons.x className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImageUpload} disabled={isLoading || !!imageUrl}>
            <Icons.image className="mr-2 h-4 w-4" />
            Photo
          </Button>
          <Button variant="outline" size="sm">
            <Icons.file className="mr-2 h-4 w-4" />
            File
          </Button>
          <Button variant="outline" size="sm">
            <Icons.link className="mr-2 h-4 w-4" />
            Link
          </Button>
        </div>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Post
        </Button>
      </CardFooter>
    </Card>
  )
}

