"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"

  const redirectToLogin = () => {
    router.push("/auth/signin")
  }

  const redirectToProfile = () => {
    router.push("/profile")
  }

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user: session?.user,
    redirectToLogin,
    redirectToProfile,
    updateSession: update,
  }
}

