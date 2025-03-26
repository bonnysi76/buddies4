import { cn } from "@/lib/utils"

interface BuddiesLogoProps {
  className?: string
  textClassName?: string
}

export function BuddiesLogo({ className, textClassName }: BuddiesLogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <span className={cn("font-bold text-primary", textClassName)}>ᗷᑌᗪᗪIEᔕ</span>
    </div>
  )
}

