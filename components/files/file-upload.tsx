"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from "@/lib/actions"

export function FileUpload() {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [description, setDescription] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("name", fileName)
      formData.append("description", description)

      const result = await uploadFile(formData)

      if (result.success) {
        toast({
          title: "File uploaded",
          description: "Your file has been uploaded successfully",
        })

        // Reset form
        setSelectedFile(null)
        setFileName("")
        setDescription("")
      } else {
        toast({
          title: "Upload failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading the file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center gap-2">
              <Input id="file" type="file" onChange={handleFileChange} className="flex-1" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">File Name</Label>
            <Input
              id="name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter a name for your file"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for your file"
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isUploading || !selectedFile}>
            {isUploading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

