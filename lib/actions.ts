"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { hash, compare } from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { sql } from "@vercel/postgres"

// User authentication actions
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate form fields
  if (!email || !password) {
    return {
      success: false,
      message: "Missing required fields",
    }
  }

  try {
    // For development purposes, allow a test account login
    if (email === "test@example.com" && password === "password") {
      // Get the test user from the database
      const { rows } = await sql`SELECT * FROM users WHERE email = 'test@example.com'`

      if (rows.length === 0) {
        return {
          success: false,
          message: "Test user not found. Please run the setup SQL script.",
        }
      }

      const user = rows[0]

      // Set a session cookie
      const cookieStore = cookies()
      cookieStore.set("user_id", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return {
        success: true,
        message: "Logged in successfully",
        redirectTo: "/dashboard",
      }
    }

    // Find the user
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`

    if (rows.length === 0) {
      return {
        success: false,
        message: "Invalid credentials",
      }
    }

    const user = rows[0]

    // Compare passwords
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid credentials",
      }
    }

    // Set a session cookie
    const cookieStore = cookies()
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      message: "Logged in successfully",
      redirectTo: "/dashboard",
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to log in",
    }
  }
}

// Register user function
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate inputs
  if (!name || !email || !password) {
    return {
      success: false,
      message: "Missing required fields",
    }
  }

  try {
    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${uuidv4()}, ${name}, ${email}, ${hashedPassword})
    `

    return {
      success: true,
      message: "Registered successfully",
      redirectTo: "/profile-setup",
    }
  } catch (error) {
    console.error("Error registering user:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to register",
    }
  }
}

// Create post function
export async function createPostFromForm(formData: FormData) {
  const content = formData.get("content") as string
  const visibility = formData.get("visibility") as string

  // Validate inputs
  if (!content) {
    return {
      success: false,
      message: "Missing required fields",
    }
  }

  try {
    // In a real app, you would get the user ID from the session
    const userId = "test-user-id" // Placeholder

    // Create post
    await sql`
      INSERT INTO posts (id, user_id, content, visibility)
      VALUES (${uuidv4()}, ${userId}, ${content}, ${visibility})
    `

    revalidatePath("/dashboard")
    return {
      success: true,
      message: "Post created successfully",
    }
  } catch (error) {
    console.error("Error creating post:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create post",
    }
  }
}

// Upload file function
export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  // Validate inputs
  if (!file || !name) {
    return {
      success: false,
      message: "Missing required fields",
    }
  }

  try {
    // In a real app, you would upload the file to a storage service
    // and get the URL
    const url = "/uploads/" + file.name // Placeholder

    // In a real app, you would get the user ID from the session
    const userId = "test-user-id" // Placeholder

    // Save file info to database
    // await sql`
    //   INSERT INTO files (id, user_id, name, url, description)
    //   VALUES (${uuidv4()}, ${userId}, ${name}, ${url}, ${description})
    // `

    revalidatePath("/dashboard")
    return {
      success: true,
      message: "File uploaded successfully",
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload file",
    }
  }
}

// Upload file function
export async function uploadFileFromForm(formData: FormData) {
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const size = formData.get("size") as string
  const url = formData.get("url") as string
  const visibility = formData.get("visibility") as string

  // Validate inputs
  if (!name || !type || !size || !url) {
    return {
      success: false,
      message: "Missing required fields",
    }
  }

  try {
    // In a real app, you would get the user ID from the session
    const userId = "test-user-id" // Placeholder

    // Save file info to database
    // await sql`
    //   INSERT INTO files (id, user_id, name, url, description)
    //   VALUES (${uuidv4()}, ${userId}, ${name}, ${url}, ${description})
    // `

    revalidatePath("/dashboard")
    return {
      success: true,
      message: "File uploaded successfully",
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload file",
    }
  }
}

// Update profile function
export async function updateProfile(formData: FormData) {
  const school = formData.get("school") as string
  const major = formData.get("major") as string
  const graduationYear = formData.get("graduation-year") as string
  const bio = formData.get("bio") as string
  const interests = formData.getAll("interests") as string[]
  const privacy = formData.get("privacy") as string
  const profileImage = formData.get("profileImage") as string

  try {
    // In a real app, you would get the user ID from the session
    const userId = "test-user-id" // Placeholder

    // Update user
    // await sql`
    //   UPDATE users
    //   SET school = ${school}, major = ${major}, graduation_year = ${graduationYear},
    //       bio = ${bio}, interests = ${interests}, privacy = ${privacy}, profile_image = ${profileImage}
    //   WHERE id = ${userId}
    // `

    revalidatePath("/dashboard")
    return {
      success: true,
      message: "Profile updated successfully",
      redirectTo: "/dashboard",
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}

