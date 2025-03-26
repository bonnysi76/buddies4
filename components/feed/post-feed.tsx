"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import Image from "next/image"

interface Post {
  id: number
  user: {
    name: string
    avatar: string
    initials: string
  }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  liked: boolean
}

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SC",
      },
      content:
        "Just finished my research paper on renewable energy sources! 🎉 Would love some feedback before I submit it tomorrow. #AcademicLife #RenewableEnergy",
      image: "/placeholder.svg?height=400&width=600",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5,
      shares: 2,
      liked: false,
    },
    {
      id: 2,
      user: {
        name: "Michael Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MJ",
      },
      content:
        "Study group for Advanced Algorithms meeting in the library at 6PM today. We'll be covering dynamic programming and graph algorithms. Everyone is welcome! #ComputerScience #StudyGroup",
      timestamp: "4 hours ago",
      likes: 15,
      comments: 8,
      shares: 3,
      liked: true,
    },
    {
      id: 3,
      user: {
        name: "Emma Williams",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "EW",
      },
      content:
        "Just uploaded my notes from today's Organic Chemistry lecture. Check them out in the Files section if you missed class or want to review! #OrganicChemistry #StudyNotes",
      timestamp: "Yesterday",
      likes: 32,
      comments: 7,
      shares: 12,
      liked: false,
    },
  ])

  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})

  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        }
        return post
      }),
    )
  }

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value,
    })
  }

  const submitComment = (postId: number) => {
    if (!commentInputs[postId]?.trim()) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
          }
        }
        return post
      }),
    )

    setCommentInputs({
      ...commentInputs,
      [postId]: "",
    })
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
            <Avatar>
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="text-sm font-medium">{post.user.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm">{post.content}</p>
            {post.image && (
              <div className="mt-3 rounded-md overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt="Post image"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
              <span>{post.likes} likes</span>
              <div className="flex space-x-2">
                <span>{post.comments} comments</span>
                <span>{post.shares} shares</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full border-t border-b py-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => toggleLike(post.id)}>
                {post.liked ? (
                  <Icons.heartFilled className="mr-2 h-4 w-4 text-red-500" />
                ) : (
                  <Icons.heart className="mr-2 h-4 w-4" />
                )}
                Like
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Icons.messageCircle className="mr-2 h-4 w-4" />
                Comment
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Icons.share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full pt-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  className="min-h-[40px] resize-none"
                  value={commentInputs[post.id] || ""}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      submitComment(post.id)
                    }
                  }}
                />
                <Button size="icon" onClick={() => submitComment(post.id)} disabled={!commentInputs[post.id]?.trim()}>
                  <Icons.send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

