import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"

// Define schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  school: text("school"),
  major: text("major"),
  graduationYear: text("graduation_year"),
  interests: text("interests").array(),
  privacySetting: text("privacy_setting").default("friends"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  type: text("type").default("text"),
  duration: integer("duration"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: text("size").notNull(),
  url: text("url").notNull(),
  visibility: text("visibility").default("private"),
  downloads: integer("downloads").default(0),
  createdAt: timestamp("created_at").defaultNow(),
})

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

client.connect()

export const db = drizzle(client)

