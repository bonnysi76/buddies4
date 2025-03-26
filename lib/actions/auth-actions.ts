"use server"

import { revalidatePath } from "next/cache"

// Mock user for demonstration
const mockUser = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  password: "$2a$10$ILHKVeGZOVgMGuOBCsJI/eIRy.1yrYUeGFJDxrQK3cAiWGQwQZR1q", // "password"
}

// Update profile (form data version)
export async function updateProfile(formData: FormData) {
  try {
    // In a real app, you would update the user in the database
    // For now, we'll just simulate a successful update

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    revalidatePath("/profile")
    return { success: true, redirectTo: "/feed" }
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

// Login user function
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate inputs
  if (!email || !password) {
    throw new Error("Missing required fields")
  }

  try {
    // Check if admin login
    if (email === "bonnysithole76@gmail.com" && password === "Montell@23") {
      return { success: true, redirectTo: "/admin" }
    }

    // For development purposes, allow a test user login
    if (email === "test@example.com" && password === "password") {
      console.log("Development test user login successful")
      return { success: true, redirectTo: "/feed" }
    }

    // In a real app, you would check the credentials against the database
    return { success: false, message: "Invalid credentials" }
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

// Register user function
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate inputs
  if (!name || !email || !password) {
    throw new Error("Missing required fields")
  }

  try {
    // In a real app, you would create the user in the database
    // For now, we'll just simulate a successful registration

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { success: true, redirectTo: "/profile-setup" }
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

