import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Buddies - Connect with Students",
  description: "A social platform for students to connect, share, and learn together",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={poppins.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'