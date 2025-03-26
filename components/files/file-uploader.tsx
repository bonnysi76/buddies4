"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { uploadFileFromForm } from "@/lib/actions"

export function FileUploader() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fileVisibility, setFileVisibility] = useState("private")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 50MB",
          variant: "destructive",
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        return
      }

      setSelectedFile(file)
      setFileName(file.name)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    try {
      // Simulate file URL generation
      const fileUrl = `/uploads/${Date.now()}-${selectedFile.name}`

      // Prepare form data
      const formData = new FormData()
      formData.append("name", fileName)
      formData.append("type", selectedFile.type)
      formData.append("size", (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB")
      formData.append("url", fileUrl)
      formData.append("visibility", fileVisibility)

      // Upload file to database
      await uploadFileFromForm(formData)

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(interval)
        setUploadProgress(100)

        setTimeout(() => {
          setIsUploading(false)
          setOpen(false)

          toast({
            title: "File uploaded successfully",
            description: `${fileName} has been uploaded with ${fileVisibility} visibility.`,
          })

          setFileName("")
          setSelectedFile(null)
          setFileVisibility("private")
          setUploadProgress(0)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        }, 500)
      }, 2000)
    } catch (error) {
      clearInterval(interval)
      setIsUploading(false)

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      })
    }
  }

  const getFileTypeIcon = () => {
    if (!selectedFile) return null

    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <Icons.fileText className="h-8 w-8 text-red-500" />
      case "doc":
      case "docx":
        return <Icons.fileText className="h-8 w-8 text-blue-500" />
      case "xls":
      case "xlsx":
        return <Icons.fileSpreadsheet className="h-8 w-8 text-green-500" />
      case "ppt":
      case "pptx":
        return <Icons.filePresentation className="h-8 w-8 text-orange-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Icons.image className="h-8 w-8 text-purple-500" />
      default:
        return <Icons.file className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="transition-all duration-200 hover:scale-[1.02] bg-primary text-primary-foreground">
          <Icons.upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Upload and share files with your classmates. Files can be up to 50MB.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                className="flex-1"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isUploading}
              />
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
              {getFileTypeIcon()}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Visibility</Label>
            <RadioGroup
              defaultValue="private"
              value={fileVisibility}
              onValueChange={setFileVisibility}
              disabled={isUploading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex items-center gap-2">
                  <Icons.lock className="h-4 w-4" />
                  Private (Only you)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="friends" />
                <Label htmlFor="friends" className="flex items-center gap-2">
                  <Icons.users className="h-4 w-4" />
                  Friends Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center gap-2">
                  <Icons.globe className="h-4 w-4" />
                  Public (All students)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={isUploading ? "cursor-not-allowed" : ""}
          >
            {isUploading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

