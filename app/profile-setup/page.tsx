import { ProfileSetupForm } from "@/components/profile/profile-setup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Set Up Your Profile | StudentConnect",
  description: "Complete your profile to get started with StudentConnect",
}

export default function ProfileSetupPage() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Set Up Your Profile</h1>
        <p className="text-muted-foreground">Tell us a bit about yourself so we can personalize your experience</p>
      </div>
      <ProfileSetupForm />
    </div>
  )
}

