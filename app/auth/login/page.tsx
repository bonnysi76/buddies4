import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { BuddiesLogo } from "@/components/buddies-logo"

export const metadata: Metadata = {
  title: "Login | Buddies",
  description: "Login to your Buddies account",
}

export default function LoginPage() {
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
              "Buddies has transformed how I collaborate with classmates and share resources. It's the perfect platform
              for students!"
            </p>
            <footer className="text-sm">Sofia Davis - Computer Science Major</footer>
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
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

