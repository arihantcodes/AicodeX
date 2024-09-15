"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Plus,
  Settings,
  LogOut,
  Code,
  FileText,
  Folder,
  Play,
  Terminal,
  Star,
  Users,
  Clock,
} from "lucide-react";

export default function CloudIDEDashboard() {
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/getuser`, {
          withCredentials: true,  // Include cookies in the request if needed
        });
        setUser(response.data.data);  // Adjust according to your response structure
      } catch (error) {
        console.error('Error fetching user details:', error);
      
      }
    };

    fetchUser();
  }, [router]);


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-semibold">{user.username}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronDown size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Alicia Koch
                  </p>
                  <p className="text-xs leading-none">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button className="mb-6">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Star className="mr-2 h-4 w-4" /> Favorites
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
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-1/3"
          />
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="shared">Shared with me</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="space-y-4"></TabsContent>
            <TabsContent value="recent">
              <p>Your recent projects will appear here.</p>
            </TabsContent>
            <TabsContent value="shared">
              <p>Projects shared with you will appear here.</p>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
