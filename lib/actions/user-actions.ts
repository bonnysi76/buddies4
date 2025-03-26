"use server"

import { db, users } from "@/lib/db"
import { eq, like, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

// Create a new user
export async function createUser(userData: {
  name: string
  email: string
  password: string
  profileImage?: string
  bio?: string
  school?: string
  major?: string
  graduationYear?: string
  interests?: string[]
  privacySetting?: string
  isAdmin?: boolean
}) {
  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email))
    if (existingUser.length > 0) {
      throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Create user
    const result = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning({ id: users.id })

    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Update user
export async function updateUser(
  id: number,
  userData: {
    name?: string
    email?: string
    profileImage?: string
    bio?: string
    school?: string
    major?: string
    graduationYear?: string
    interests?: string[]
    privacySetting?: string
  },
) {
  try {
    await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))

    revalidatePath(`/profile/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: number) {
  try {
    const result = await db.select().from(users).where(eq(users.id, id))
    return result[0] || null
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const result = await db.select().from(users).where(eq(users.email, email))
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

// Search users
export async function searchUsers(query: string, limit = 10) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(or(like(users.name, `%${query}%`), like(users.email, `%${query}%`), like(users.school, `%${query}%`)))
      .limit(limit)
    return result
  } catch (error) {
    console.error("Error searching users:", error)
    throw error
  }
}

