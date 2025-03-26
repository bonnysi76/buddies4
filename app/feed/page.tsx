import { CreatePostCard } from "@/components/posts/create-post-card"

export default function FeedPage() {
  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
      <CreatePostCard />
      <div className="space-y-4">
        {/* Posts will be displayed here */}
        <div className="text-center text-muted-foreground py-8">
          No posts to display yet. Create your first post above!
        </div>
      </div>
    </div>
  )
}

