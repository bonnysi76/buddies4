"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Google } from "@/components/brand-icons"

export function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Since we don't have a backend, we'll simulate a successful registration
      // and redirect to the sign-in page
      toast({
        title: "Account created",
        description: "Please sign in with your new account",
      })

      // In a real app, you would create the user in your database here

      // Redirect to sign in page
      router.push("/auth/signin")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn("google", { callbackUrl: "/profile-setup" })
    } catch (error) {
      console.error("Google sign in error:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading || isGoogleLoading}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading || isGoogleLoading}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || isGoogleLoading}
        onClick={handleGoogleSignIn}
        className="bg-white text-black hover:bg-gray-100 border-gray-300"
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}

