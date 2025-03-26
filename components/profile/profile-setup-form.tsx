"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { updateProfile } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, PlusCircle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data - in a real app, these would come from the database
const popularSchools = [
  "Harvard University",
  "Stanford University",
  "Massachusetts Institute of Technology",
  "University of California, Berkeley",
  "University of Oxford",
  "University of Cambridge",
  "California Institute of Technology",
  "Princeton University",
  "Yale University",
  "Columbia University",
  "University of Chicago",
  "University of Pennsylvania",
  "Cornell University",
  "University of Michigan",
  "Johns Hopkins University",
  "Duke University",
  "University of California, Los Angeles",
  "New York University",
  "University of Toronto",
  "University of Washington",
]

const popularInterests = [
  "Programming",
  "Design",
  "Mathematics",
  "Physics",
  "Literature",
  "History",
  "Art",
  "Music",
  "Sports",
  "Photography",
  "Machine Learning",
  "Data Science",
  "Artificial Intelligence",
  "Web Development",
  "Mobile Development",
  "Blockchain",
  "Cybersecurity",
  "Robotics",
  "Entrepreneurship",
  "Finance",
  "Marketing",
  "Psychology",
  "Biology",
  "Chemistry",
  "Environmental Science",
]

export function ProfileSetupForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [selectedInterests, setSelectedInterests] = useState([])
  const [schoolSearch, setSchoolSearch] = useState("")
  const [filteredSchools, setFilteredSchools] = useState(popularSchools)
  const [newSchoolDialogOpen, setNewSchoolDialogOpen] = useState(false)
  const [newSchool, setNewSchool] = useState("")
  const [newInterestDialogOpen, setNewInterestDialogOpen] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const [interestSearch, setInterestSearch] = useState("")
  const [filteredInterests, setFilteredInterests] = useState(popularInterests)
  const [availableInterests, setAvailableInterests] = useState(popularInterests)
  const [formData, setFormData] = useState({
    school: "",
    major: "",
    graduationYear: "2025",
    bio: "",
    privacy: "friends",
  })

  // Filter schools based on search
  useEffect(() => {
    if (schoolSearch) {
      setFilteredSchools(popularSchools.filter((school) => school.toLowerCase().includes(schoolSearch.toLowerCase())))
    } else {
      setFilteredSchools(popularSchools)
    }
  }, [schoolSearch])

  // Filter interests based on search
  useEffect(() => {
    if (interestSearch) {
      setFilteredInterests(
        availableInterests.filter((interest) => interest.toLowerCase().includes(interestSearch.toLowerCase())),
      )
    } else {
      setFilteredInterests(availableInterests)
    }
  }, [interestSearch, availableInterests])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = new FormData()
      data.append("school", formData.school)
      data.append("major", formData.major)
      data.append("graduation-year", formData.graduationYear)
      data.append("bio", formData.bio)
      selectedInterests.forEach((interest) => {
        data.append("interests", interest)
      })
      data.append("privacy", formData.privacy)
      data.append("profileImage", profileImage)

      toast({
        title: "Setting up your profile",
        description: "Please wait while we set up your profile...",
      })

      try {
        const result = await updateProfile(data)

        // Handle redirect on the client side
        if (result.success && result.redirectTo) {
          router.push(result.redirectTo)
        }
      } catch (error) {
        // Check if it's a database connection error
        if (error instanceof Error && error.message.includes("DATABASE_URL")) {
          toast({
            title: "Database connection error",
            description: "Please make sure your database connection is properly configured.",
            variant: "destructive",
          })
        } else {
          throw error
        }
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setTimeout(() => {
        setProfileImage(reader.result)
        setIsUploading(false)
        clearInterval(interval)
        setUploadProgress(100)

        toast({
          title: "Image uploaded",
          description: "Your profile picture has been uploaded successfully",
        })

        setTimeout(() => {
          setUploadProgress(0)
        }, 1000)
      }, 2000)
    }
    reader.readAsDataURL(file)
  }

  const addInterest = (interest) => {
    if (selectedInterests.length >= 5) {
      toast({
        title: "Maximum interests reached",
        description: "You can select up to 5 interests",
      })
      return
    }

    if (!selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => [...prev, interest])
    }
  }

  const removeInterest = (interest) => {
    setSelectedInterests((prev) => prev.filter((i) => i !== interest))
  }

  const handleAddNewSchool = () => {
    if (!newSchool.trim()) return

    setFormData((prev) => ({ ...prev, school: newSchool }))
    setNewSchoolDialogOpen(false)
    setNewSchool("")

    toast({
      title: "School added",
      description: `"${newSchool}" has been added as your school.`,
    })
  }

  const handleAddNewInterest = () => {
    if (!newInterest.trim()) return

    // Add to available interests
    setAvailableInterests((prev) => [...prev, newInterest])

    // Add to selected interests
    if (selectedInterests.length < 5) {
      setSelectedInterests((prev) => [...prev, newInterest])
    }

    setNewInterestDialogOpen(false)
    setNewInterest("")

    toast({
      title: "Interest added",
      description: `"${newInterest}" has been added to your interests.`,
    })
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16">
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-background shadow-md hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.camera className="h-4 w-4" />
                )}
                <span className="sr-only">Upload profile picture</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a profile picture or use the one from your social account
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="school">School/University</Label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" role="combobox" className="justify-between w-full font-normal">
                      {formData.school ? formData.school : "Select your school..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-y-auto">
                    <div className="px-3 py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 opacity-50" />
                        <Input
                          placeholder="Search schools..."
                          value={schoolSearch}
                          onChange={(e) => setSchoolSearch(e.target.value)}
                          className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    {filteredSchools.length > 0 ? (
                      filteredSchools.map((school) => (
                        <DropdownMenuItem
                          key={school}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, school }))
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", formData.school === school ? "opacity-100" : "opacity-0")}
                          />
                          {school}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-center">
                        <p>No school found.</p>
                        <Button
                          variant="link"
                          className="mt-1 text-primary"
                          onClick={() => {
                            setNewSchoolDialogOpen(true)
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add "{schoolSearch}"
                        </Button>
                      </div>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        setNewSchoolDialogOpen(true)
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add new school
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="major">Major/Field of Study</Label>
              <Input
                id="major"
                placeholder="E.g., Computer Science, Biology"
                disabled={isLoading}
                value={formData.major}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="graduationYear">Expected Graduation Year</Label>
            <Select
              value={formData.graduationYear}
              onValueChange={(value) => handleSelectChange("graduationYear", value)}
            >
              <SelectTrigger id="graduationYear">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="interests">Interests (Select up to 5)</Label>
              <span className="text-xs text-muted-foreground">{selectedInterests.length}/5 selected</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {selectedInterests.map((interest) => (
                <Badge key={interest} variant="secondary" className="px-3 py-1">
                  {interest}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => removeInterest(interest)}
                  >
                    <Icons.x className="h-3 w-3" />
                    <span className="sr-only">Remove {interest}</span>
                  </Button>
                </Badge>
              ))}
            </div>

            {selectedInterests.length < 5 && (
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" role="combobox" className="justify-between w-full font-normal">
                      Add an interest
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-y-auto">
                    <div className="px-3 py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 opacity-50" />
                        <Input
                          placeholder="Search interests..."
                          value={interestSearch}
                          onChange={(e) => setInterestSearch(e.target.value)}
                          className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    {filteredInterests.filter((interest) => !selectedInterests.includes(interest)).length > 0 ? (
                      filteredInterests
                        .filter((interest) => !selectedInterests.includes(interest))
                        .map((interest) => (
                          <DropdownMenuItem key={interest} onClick={() => addInterest(interest)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {interest}
                          </DropdownMenuItem>
                        ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-center">
                        <p>No interest found.</p>
                        <Button
                          variant="link"
                          className="mt-1 text-primary"
                          onClick={() => {
                            setNewInterest(interestSearch)
                            setNewInterestDialogOpen(true)
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add "{interestSearch}"
                        </Button>
                      </div>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        setNewInterestDialogOpen(true)
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add new interest
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself..."
              className="min-h-[100px] resize-none"
              disabled={isLoading}
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="privacy">Privacy Settings</Label>
            <Select value={formData.privacy} onValueChange={(value) => handleSelectChange("privacy", value)}>
              <SelectTrigger id="privacy">
                <SelectValue placeholder="Select privacy setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Icons.globe className="mr-2 h-4 w-4" />
                    <span>Public - Anyone can see your profile</span>
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center">
                    <Icons.users className="mr-2 h-4 w-4" />
                    <span>Friends Only - Only connections can see your profile</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Icons.lock className="mr-2 h-4 w-4" />
                    <span>Private - Only you can see your profile</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full transition-all duration-200 hover:scale-[1.02] bg-primary text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Complete Profile Setup
          </Button>
        </form>
      </CardContent>

      {/* Add New School Dialog */}
      <Dialog open={newSchoolDialogOpen} onOpenChange={setNewSchoolDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-school">School Name</Label>
              <Input
                id="new-school"
                placeholder="Enter school name"
                value={newSchool}
                onChange={(e) => setNewSchool(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSchoolDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewSchool} disabled={!newSchool.trim()}>
              Add School
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Interest Dialog */}
      <Dialog open={newInterestDialogOpen} onOpenChange={setNewInterestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Interest</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-interest">Interest Name</Label>
              <Input
                id="new-interest"
                placeholder="Enter interest name"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewInterestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewInterest} disabled={!newInterest.trim()}>
              Add Interest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

