"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"
import { BuddiesLogo } from "@/components/buddies-logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    // In a real app, this would be a proper auth check
    const checkAdmin = setTimeout(() => {
      // Simulate admin check
      const isAdmin = true // This would be a real check in production

      if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        })
        router.push("/auth/login")
      } else {
        setIsAdmin(true)
        toast({
          title: "Welcome, Admin",
          description: "You are logged in as Bonny.",
        })
      }
    }, 500)

    return () => clearTimeout(checkAdmin)
  }, [router, toast])

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <BuddiesLogo textClassName="text-xl" />
            <span className="font-bold ml-2">Admin</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Icons.bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <Icons.user className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icons.settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/auth/login")}>
                  <Icons.logout className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="container flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Icons.download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content Moderation</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Icons.users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Icons.userCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">842</div>
                  <p className="text-xs text-muted-foreground">+5% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Posts Today</CardTitle>
                  <Icons.messageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">324</div>
                  <p className="text-xs text-muted-foreground">+18% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
                  <Icons.fileUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">128</div>
                  <p className="text-xs text-muted-foreground">+4% from last week</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Activity chart would go here
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Signups</CardTitle>
                  <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">New User {i}</p>
                          <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                        </div>
                        <Badge variant="outline">New</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Filter</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All Users</DropdownMenuItem>
                      <DropdownMenuItem>Active Users</DropdownMenuItem>
                      <DropdownMenuItem>Inactive Users</DropdownMenuItem>
                      <DropdownMenuItem>Reported Users</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <span>User {i + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>user{i + 1}@example.com</TableCell>
                        <TableCell>
                          <Badge variant={i % 3 === 0 ? "outline" : "default"}>
                            {i % 3 === 0 ? "Inactive" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(Date.now() - i * 86400000 * 7).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Icons.moreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Suspend User</DropdownMenuItem>
                              <DropdownMenuItem>Delete User</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation Queue</CardTitle>
                <CardDescription>Review and approve content before it's published</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                                <AvatarFallback>U{i}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-sm">User {i + 1}</CardTitle>
                                <CardDescription className="text-xs">{new Date().toLocaleTimeString()}</CardDescription>
                              </div>
                            </div>
                            <Badge>Pending Review</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">
                            This is a post about my recent project on climate change. I've attached some research data
                            and would like to share it with the community. #ClimateAction #Research
                          </p>
                          {i % 2 === 0 && (
                            <div className="mt-3 rounded-md overflow-hidden">
                              <div className="w-full h-[200px] bg-muted flex items-center justify-center">
                                <Icons.image className="h-12 w-12 text-muted-foreground/50" />
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Icons.check className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500">
                              <Icons.x className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Icons.flag className="mr-2 h-4 w-4" />
                            Flag for Review
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Reports</CardTitle>
                <CardDescription>Review and manage reports submitted by users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Reported User</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32&text=R${i}`} />
                              <AvatarFallback>R{i}</AvatarFallback>
                            </Avatar>
                            <span>Reporter {i + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32&text=U${i}`} />
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <span>User {i + 10}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {["Inappropriate content", "Harassment", "Spam", "Misinformation", "Other"][i]}
                        </TableCell>
                        <TableCell>{new Date(Date.now() - i * 86400000).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={i % 3 === 0 ? "outline" : i % 3 === 1 ? "default" : "secondary"}>
                            {i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Resolved" : "Investigating"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Icons.moreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Contact Reporter</DropdownMenuItem>
                              <DropdownMenuItem>Contact Reported User</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <footer className="border-t py-4 bg-background">
        <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <BuddiesLogo textClassName="text-lg" />
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Buddies. All rights reserved.</p>
          </div>
          <p className="text-sm font-medium">
            Created by <span className="font-bold">Bonny</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

