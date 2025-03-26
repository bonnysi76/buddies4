import { Icons } from "./icons"

export function Footer() {
  return (
    <footer className="border-t py-4 bg-background">
      <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-5 w-5" />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Buddies. All rights reserved.</p>
        </div>
        <p className="text-sm font-medium">
          Created by <span className="font-bold">Bonny</span>
        </p>
      </div>
    </footer>
  )
}

