"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Star,
  Users,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  username: string;
  email: string;
  projects?: Array<{
    name: string;
    description: string;
  }>;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Token not found. Please log in again.");
        }
  
        const username = params.username as string;
        if (!username) {
          throw new Error("Username not found in URL.");
        }
  
        const response = await axios.get(`http://localhost:3006/api/v1/user/dashboard/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        console.log(response);  // Log response to ensure data is received
        setUserData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [params.username]);
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/signin');
  };


  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 p-4 flex flex-col border-r-2 border-blue-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
          
            <span className="ml-2 font-semibold">{userData?.username}</span>
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
                  <p className="text-sm font-medium leading-none">username{userData?.username}</p>
                  <p className="text-xs leading-none">{userData?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button className="mb-6">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
        <nav className="space-y-2 ">
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
            <TabsContent value="projects" className="space-y-4">
              {userData?.projects && userData.projects.length > 0 ? (
                userData.projects.map((project, index) => (
                  <div key={index} className="p-4 border rounded">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p>{project.description}</p>
                  </div>
                ))
              ) : (
                <p>No projects found.</p>
              )}
            </TabsContent>
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
};

export default Dashboard;