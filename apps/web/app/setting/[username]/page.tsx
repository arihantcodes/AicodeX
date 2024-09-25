/* eslint-disable turbo/no-undeclared-env-vars */
"use client";
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Settings, LogOut, Code, Star, Users, Terminal } from "lucide-react"
import Link from "next/link"

interface UserData {
  avatar?: string
  username: string
  newPassword: string
  currentPassword: string
  email?: string
}

export default function Dashboard() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    username: "",
    newPassword: "",
    currentPassword: "",
    email: "",
  })
  const [avatarUrl, setAvatarUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) throw new Error("Token not found. Please log in again.")

        const username = params.username as string
        if (!username) throw new Error("Username not found in URL.")

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/profile/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setUserData(response.data.data)
        
        // Generate a random avatar URL
        const randomSeed = Math.random().toString(36).substring(7)
        setAvatarUrl(`https://api.dicebear.com/6.x/avataaars/svg?seed=${randomSeed}`)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch user data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [params.username, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) throw new Error("Token not found. Please log in again.")

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/update-profile`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      // Refresh user data after update
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/profile/${params.username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUserData(response.data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    router.push("/signin")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 p-4 flex flex-col border-r-2 border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="ml-2 font-semibold">{userData.username}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronDown size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userData.username}</p>
                  <p className="text-xs leading-none">{userData.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <Link href="/setting">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* side navbar */}
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Star className="mr-2 h-4 w-4" />
            <Link href={`/dashboard/${userData?.username}`}>Dashboard</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start active">
            <Code className="mr-2 h-4 w-4" /> My Projects
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" /> Collaborations
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Terminal className="mr-2 h-4 w-4" /> Console
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" /> 
            <Link href={`/setting/${userData?.username}`}>Setting</Link>
          </Button>
        </nav>
      </div>
      <div className="flex-1 flex flex-col">
        <main className="mt-32 bg-background">
          <Card className="w-full max-w-4xl mx-auto mt-8 bg-background">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={avatarUrl} alt="Profile Avatar" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>View and edit your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="view" className="w-full ">
                <TabsList className="grid w-full grid-cols-2 bg-white">
                  <TabsTrigger value="view">View Profile</TabsTrigger>
                  <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="view">
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Username</Label>
                      <p className="text-lg">{userData.username}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-lg">{userData.email}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="edit">
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">New Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        placeholder="Enter new username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={userData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={userData.currentPassword}
                        onChange={handleChange}
                        required
                        placeholder="Enter current password"
                      />
                    </div>
                    <Button type="submit" disabled={saving} className="w-full">
                      {saving ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}