import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { sql } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUser.rowCount > 0) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate a unique ID
    const userId = uuidv4()

    // Create user
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword})
    `

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

