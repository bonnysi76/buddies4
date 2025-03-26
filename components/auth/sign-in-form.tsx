"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Google } from "@/components/brand-icons"

export function SignInForm() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/feed"
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("test@example.com")
  const [password, setPassword] = useState<string>("password")

  // Check for error parameter in URL
  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      toast({
        title: "Authentication error",
        description: getErrorMessage(error),
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "OAuthSignin":
        return "Error starting the OAuth sign-in flow."
      case "OAuthCallback":
        return "Error completing the OAuth sign-in flow."
      case "OAuthCreateAccount":
        return "Error creating a user from the OAuth sign-in flow."
      case "EmailCreateAccount":
        return "Error creating a user from the email sign-in flow."
      case "Callback":
        return "Error during the OAuth callback."
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account."
      case "EmailSignin":
        return "Error sending the email for sign-in."
      case "CredentialsSignin":
        return "Invalid credentials. Please check your email and password."
      case "SessionRequired":
        return "You must be signed in to access this page."
      case "ClientFetch":
        return "Network error occurred while trying to sign in. Please check your connection."
      default:
        return "An unknown error occurred. Please try again."
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (!result?.error) {
        router.push(callbackUrl)
        router.refresh()
      } else {
        toast({
          title: "Authentication error",
          description: getErrorMessage(result.error),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Sign in error:", error)
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
      // Use the absolute URL for the callback
      await signIn("google", {
        callbackUrl: window.location.origin + callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error("Google sign in error:", error)
      // Error will be handled by the redirect
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading || isGoogleLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
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
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}

