"use server"

import { db, posts, users } from "@/lib/db"
import { eq, desc, like, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Create a new post
export async function createPost(postData: {
  userId: number
  content: string
  image?: string
}) {
  try {
    const result = await db.insert(posts).values(postData).returning({ id: posts.id })
    revalidatePath("/feed")
    return result[0]
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

// Get post by ID
export async function getPostById(id: number) {
  try {
    const result = await db.select().from(posts).where(eq(posts.id, id))
    return result[0] || null
  } catch (error) {
    console.error("Error getting post:", error)
    throw error
  }
}

// Get posts by user ID
export async function getPostsByUserId(userId: number, limit = 10, offset = 0) {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset)
    return result
  } catch (error) {
    console.error("Error getting user posts:", error)
    throw error
  }
}

// Get feed posts (with user info)
export async function getFeedPosts(limit = 10, offset = 0) {
  try {
    const result = await db
      .select({
        post: posts,
        userName: users.name,
        userProfileImage: users.profileImage,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset)

    return result
  } catch (error) {
    console.error("Error getting feed posts:", error)
    throw error
  }
}

// Search posts
export async function searchPosts(query: string, limit = 10) {
  try {
    const result = await db
      .select({
        post: posts,
        userName: users.name,
        userProfileImage: users.profileImage,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(like(posts.content, `%${query}%`))
      .orderBy(desc(posts.createdAt))
      .limit(limit)

    return result
  } catch (error) {
    console.error("Error searching posts:", error)
    throw error
  }
}

// Update post
export async function updatePost(
  id: number,
  postData: {
    content?: string
    image?: string
  },
) {
  try {
    await db
      .update(posts)
      .set({
        ...postData,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))

    revalidatePath("/feed")
    return { success: true }
  } catch (error) {
    console.error("Error updating post:", error)
    throw error
  }
}

// Like post
export async function likePost(id: number) {
  try {
    await db
      .update(posts)
      .set({
        likes: sql`${posts.likes} + 1`,
      })
      .where(eq(posts.id, id))

    revalidatePath("/feed")
    return { success: true }
  } catch (error) {
    console.error("Error liking post:", error)
    throw error
  }
}

// Add comment to post
export async function addCommentToPost(id: number) {
  try {
    await db
      .update(posts)
      .set({
        comments: sql`${posts.comments} + 1`,
      })
      .where(eq(posts.id, id))

    revalidatePath("/feed")
    return { success: true }
  } catch (error) {
    console.error("Error adding comment to post:", error)
    throw error
  }
}

// Share post
export async function sharePost(id: number) {
  try {
    await db
      .update(posts)
      .set({
        shares: sql`${posts.shares} + 1`,
      })
      .where(eq(posts.id, id))

    revalidatePath("/feed")
    return { success: true }
  } catch (error) {
    console.error("Error sharing post:", error)
    throw error
  }
}

// Delete post
export async function deletePost(id: number) {
  try {
    await db.delete(posts).where(eq(posts.id, id))
    revalidatePath("/feed")
    return { success: true }
  } catch (error) {
    console.error("Error deleting post:", error)
    throw error
  }
}

// Create post (form data version)
export async function createPostFromForm(formData: FormData) {
  // In a real app, you would get the user ID from the session
  const userId = 1 // Placeholder

  const content = formData.get("content") as string
  const image = formData.get("image") as string

  if (!content) {
    throw new Error("Post content is required")
  }

  try {
    await createPost({
      userId,
      content,
      image,
    })

    revalidatePath("/feed")
    return { success: true }
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

