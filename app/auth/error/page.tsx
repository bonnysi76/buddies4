"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BuddiesLogo } from "@/components/buddies-logo"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return "There is a problem with the server configuration. Please contact support."
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in."
      case "Verification":
        return "The verification link may have expired or has already been used."
      case "OAuthSignin":
        return "Error in the OAuth sign-in process. Please try again."
      case "OAuthCallback":
        return "Error in the OAuth callback process. Please try again."
      case "OAuthCreateAccount":
        return "Could not create an OAuth account. Please try again."
      case "EmailCreateAccount":
        return "Could not create an email account. Please try again."
      case "Callback":
        return "Error in the callback process. Please try again."
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in with the original provider."
      case "EmailSignin":
        return "Error sending the email. Please try again."
      case "CredentialsSignin":
        return "Invalid credentials. Please check your email and password."
      case "SessionRequired":
        return "Please sign in to access this page."
      default:
        return "An unknown error occurred. Please try again."
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <BuddiesLogo textClassName="text-3xl" />
          </div>
          <CardTitle className="text-2xl text-center">Authentication Error</CardTitle>
          <CardDescription className="text-center">{getErrorMessage(error)}</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Please try signing in again or contact support if the problem persists.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/signin">Back to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

