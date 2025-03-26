"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface File {
  id: number
  name: string
  type: string
  size: string
  uploadDate: string
  visibility: "private" | "friends" | "public"
  downloads: number
}

export function FileList() {
  const [files, setFiles] = useState<File[]>([
    {
      id: 1,
      name: "Physics Notes.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2 days ago",
      visibility: "public",
      downloads: 15,
    },
    {
      id: 2,
      name: "Research Paper Draft.docx",
      type: "docx",
      size: "1.8 MB",
      uploadDate: "1 week ago",
      visibility: "friends",
      downloads: 5,
    },
    {
      id: 3,
      name: "Calculus Formulas.pdf",
      type: "pdf",
      size: "3.2 MB",
      uploadDate: "2 weeks ago",
      visibility: "public",
      downloads: 32,
    },
    {
      id: 4,
      name: "Project Presentation.pptx",
      type: "pptx",
      size: "5.7 MB",
      uploadDate: "3 weeks ago",
      visibility: "private",
      downloads: 0,
    },
    {
      id: 5,
      name: "Study Group Schedule.xlsx",
      type: "xlsx",
      size: "1.2 MB",
      uploadDate: "1 month ago",
      visibility: "friends",
      downloads: 8,
    },
  ])

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <Icons.fileText className="h-6 w-6 text-red-500" />
      case "docx":
        return <Icons.fileText className="h-6 w-6 text-blue-500" />
      case "pptx":
        return <Icons.filePresentation className="h-6 w-6 text-orange-500" />
      case "xlsx":
        return <Icons.fileSpreadsheet className="h-6 w-6 text-green-500" />
      default:
        return <Icons.file className="h-6 w-6" />
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Icons.lock className="h-4 w-4" />
      case "friends":
        return <Icons.users className="h-4 w-4" />
      case "public":
        return <Icons.globe className="h-4 w-4" />
      default:
        return null
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "Private"
      case "friends":
        return "Friends Only"
      case "public":
        return "Public"
      default:
        return ""
    }
  }

  const deleteFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All Files</TabsTrigger>
        <TabsTrigger value="my">My Files</TabsTrigger>
        <TabsTrigger value="shared">Shared with Me</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <Card key={file.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <CardTitle className="text-base">{file.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icons.moreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteFile(file.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-xs">
                  {file.size} • Uploaded {file.uploadDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  {getVisibilityIcon(file.visibility)}
                  <span className="ml-1">{getVisibilityLabel(file.visibility)}</span>
                  <span className="mx-2">•</span>
                  <span>{file.downloads} downloads</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Icons.download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="my" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files
            .filter((file) => file.visibility === "private")
            .map((file) => (
              <Card key={file.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file.type)}
                      <CardTitle className="text-base">{file.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icons.moreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteFile(file.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="text-xs">
                    {file.size} • Uploaded {file.uploadDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getVisibilityIcon(file.visibility)}
                    <span className="ml-1">{getVisibilityLabel(file.visibility)}</span>
                    <span className="mx-2">•</span>
                    <span>{file.downloads} downloads</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Icons.download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </TabsContent>
      <TabsContent value="shared" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files
            .filter((file) => file.visibility === "friends" || file.visibility === "public")
            .map((file) => (
              <Card key={file.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file.type)}
                      <CardTitle className="text-base">{file.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icons.moreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="text-xs">
                    {file.size} • Uploaded {file.uploadDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getVisibilityIcon(file.visibility)}
                    <span className="ml-1">{getVisibilityLabel(file.visibility)}</span>
                    <span className="mx-2">•</span>
                    <span>{file.downloads} downloads</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Icons.download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

