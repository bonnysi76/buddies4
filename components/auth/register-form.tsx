"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { registerUser } from "@/lib/actions"

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
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

  // Update the handleSubmit function to handle the redirect on the client side
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
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("password", formData.password)

      const result = await registerUser(data)

      // Handle redirect on the client side
      if (result.success && result.redirectTo) {
        router.push(result.redirectTo)
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSocialSignup = (provider: string) => {
    setIsLoading(true)

    toast({
      title: `Signing up with ${provider}`,
      description: "Please wait while we set up your account...",
    })

    // Simulate social signup
    setTimeout(() => {
      setIsLoading(false)
      router.push("/profile-setup")
    }, 1000)
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
              disabled={isLoading}
              required
              value={formData.name}
              onChange={handleChange}
              className="border-input bg-background"
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
              disabled={isLoading}
              required
              value={formData.email}
              onChange={handleChange}
              className="border-input bg-background"
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
              disabled={isLoading}
              required
              value={formData.password}
              onChange={handleChange}
              className="border-input bg-background"
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
              disabled={isLoading}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border-input bg-background"
            />
          </div>
          <Button disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleSocialSignup("google")}>
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleSocialSignup("apple")}>
          <Icons.apple className="mr-2 h-4 w-4" />
          Apple
        </Button>
      </div>
    </div>
  )
}

