"use server"

import { db, files, users } from "@/lib/db"
import { eq, desc, and, like, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { sql } from "drizzle-orm"

// Upload a file
export async function uploadFile(fileData: {
  userId: number
  name: string
  type: string
  size: string
  url: string
  visibility?: string
}) {
  try {
    const result = await db
      .insert(files)
      .values({
        ...fileData,
        visibility: fileData.visibility || "private",
      })
      .returning({ id: files.id })

    revalidatePath("/files")
    return result[0]
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

// Get file by ID
export async function getFileById(id: number) {
  try {
    const result = await db.select().from(files).where(eq(files.id, id))
    return result[0] || null
  } catch (error) {
    console.error("Error getting file:", error)
    throw error
  }
}

// Get files by user ID
export async function getFilesByUserId(userId: number, limit = 20, offset = 0) {
  try {
    const result = await db
      .select()
      .from(files)
      .where(eq(files.userId, userId))
      .orderBy(desc(files.createdAt))
      .limit(limit)
      .offset(offset)

    return result
  } catch (error) {
    console.error("Error getting user files:", error)
    throw error
  }
}

// Get public files
export async function getPublicFiles(limit = 20, offset = 0) {
  try {
    const result = await db
      .select({
        file: files,
        userName: users.name,
        userProfileImage: users.profileImage,
      })
      .from(files)
      .innerJoin(users, eq(files.userId, users.id))
      .where(eq(files.visibility, "public"))
      .orderBy(desc(files.createdAt))
      .limit(limit)
      .offset(offset)

    return result
  } catch (error) {
    console.error("Error getting public files:", error)
    throw error
  }
}

// Search files
export async function searchFiles(query: string, userId: number, includeShared = true) {
  try {
    let whereClause

    if (includeShared) {
      // Include user's files and public/shared files
      whereClause = or(eq(files.userId, userId), eq(files.visibility, "public"), eq(files.visibility, "friends"))
    } else {
      // Only include user's files
      whereClause = eq(files.userId, userId)
    }

    const result = await db
      .select()
      .from(files)
      .where(and(whereClause, like(files.name, `%${query}%`)))
      .orderBy(desc(files.createdAt))

    return result
  } catch (error) {
    console.error("Error searching files:", error)
    throw error
  }
}

// Update file
export async function updateFile(
  id: number,
  fileData: {
    name?: string
    visibility?: string
  },
) {
  try {
    await db.update(files).set(fileData).where(eq(files.id, id))

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error updating file:", error)
    throw error
  }
}

// Increment download count
export async function incrementDownloadCount(id: number) {
  try {
    await db
      .update(files)
      .set({
        downloads: sql`${files.downloads} + 1`,
      })
      .where(eq(files.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error incrementing download count:", error)
    throw error
  }
}

// Delete file
export async function deleteFile(id: number) {
  try {
    await db.delete(files).where(eq(files.id, id))
    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

// Upload file (form data version)
export async function uploadFileFromForm(formData: FormData) {
  // In a real app, you would get the user ID from the session
  const userId = 1 // Placeholder

  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const size = formData.get("size") as string
  const url = formData.get("url") as string
  const visibility = (formData.get("visibility") as string) || "private"

  if (!name || !type || !size || !url) {
    throw new Error("Missing required fields")
  }

  try {
    await uploadFile({
      userId,
      name,
      type,
      size,
      url,
      visibility,
    })

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

