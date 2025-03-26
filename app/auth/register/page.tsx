import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { BuddiesLogo } from "@/components/buddies-logo"

export const metadata: Metadata = {
  title: "Register | Buddies",
  description: "Create a new Buddies account",
}

export default function RegisterPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <BuddiesLogo textClassName="text-white text-2xl" />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Join thousands of students who are already connecting, sharing, and learning together on Buddies!"
            </p>
            <footer className="text-sm">The Buddies Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-6">
              <BuddiesLogo textClassName="text-4xl" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
          </div>
          <RegisterForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

