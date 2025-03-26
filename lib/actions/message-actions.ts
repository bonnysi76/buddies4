"use server"

import { db, messages, users } from "@/lib/db"
import { eq, and, desc, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Send a message
export async function sendMessage(messageData: {
  senderId: number
  receiverId: number
  content: string
  type?: string
  duration?: number
}) {
  try {
    const result = await db
      .insert(messages)
      .values({
        ...messageData,
        type: messageData.type || "text",
      })
      .returning({ id: messages.id })

    revalidatePath("/messages")
    return result[0]
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Get message by ID
export async function getMessageById(id: number) {
  try {
    const result = await db.select().from(messages).where(eq(messages.id, id))
    return result[0] || null
  } catch (error) {
    console.error("Error getting message:", error)
    throw error
  }
}

// Get conversation between two users
export async function getConversation(userId1: number, userId2: number, limit = 50) {
  try {
    const result = await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1)),
        ),
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit)

    return result.reverse() // Return in chronological order
  } catch (error) {
    console.error("Error getting conversation:", error)
    throw error
  }
}

// Get user conversations (list of users with latest message)
export async function getUserConversations(userId: number) {
  try {
    // This is a complex query that requires a subquery to get the latest message for each conversation
    // For simplicity, we'll use a basic approach here
    const sentMessages = await db
      .select({
        message: messages,
        userName: users.name,
        userProfileImage: users.profileImage,
      })
      .from(messages)
      .innerJoin(users, eq(messages.receiverId, users.id))
      .where(eq(messages.senderId, userId))
      .orderBy(desc(messages.createdAt))

    const receivedMessages = await db
      .select({
        message: messages,
        userName: users.name,
        userProfileImage: users.profileImage,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.receiverId, userId))
      .orderBy(desc(messages.createdAt))

    // Combine and sort by date
    const allMessages = [...sentMessages, ...receivedMessages].sort(
      (a, b) => new Date(b.message.createdAt).getTime() - new Date(a.message.createdAt).getTime(),
    )

    // Deduplicate conversations (keep only the latest message for each user)
    const conversationMap = new Map()
    allMessages.forEach((item) => {
      const otherUserId = item.message.senderId === userId ? item.message.receiverId : item.message.senderId
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, item)
      }
    })

    return Array.from(conversationMap.values())
  } catch (error) {
    console.error("Error getting user conversations:", error)
    throw error
  }
}

// Mark message as read
export async function markMessageAsRead(id: number) {
  try {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id))

    revalidatePath("/messages")
    return { success: true }
  } catch (error) {
    console.error("Error marking message as read:", error)
    throw error
  }
}

// Mark all messages from a sender as read
export async function markAllMessagesAsRead(senderId: number, receiverId: number) {
  try {
    await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId), eq(messages.read, false)))

    revalidatePath("/messages")
    return { success: true }
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

// Delete message
export async function deleteMessage(id: number) {
  try {
    await db.delete(messages).where(eq(messages.id, id))
    revalidatePath("/messages")
    return { success: true }
  } catch (error) {
    console.error("Error deleting message:", error)
    throw error
  }
}

// Send message (form data version)
export async function sendMessageFromForm(formData: FormData) {
  // In a real app, you would get the user ID from the session
  const senderId = 1 // Placeholder

  const receiverId = Number.parseInt(formData.get("receiverId") as string)
  const content = formData.get("content") as string
  const type = (formData.get("type") as string) || "text"
  const duration = type === "voice" ? Number.parseInt(formData.get("duration") as string) : undefined

  if (!receiverId || !content) {
    throw new Error("Missing required fields")
  }

  try {
    await sendMessage({
      senderId,
      receiverId,
      content,
      type,
      duration,
    })

    revalidatePath("/messages")
    return { success: true }
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

