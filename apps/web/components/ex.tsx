"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  MoreVertical,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/moon";
import { useToast } from "@/components/hooks/use-toast";

import ClipLoader from "react-spinners/ClipLoader";
interface UserData {
  username: string;
  email: string;
  projects?: Array<{
    name: string;
    description: string;
  }>;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  interface Project {
    id: number;
    projectname: string;
    description: string;
    language: string;
    createdAt: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/dashboard/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response); // Log response to ensure data is received
        setUserData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [params.username]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/signin");
  };

  const createproject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading when form is submitted
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/createproject`,
        {
          projectname: formData.get("projectname"),
          description: formData.get("description"),
          language: formData.get("language"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Project created:", response.data);
      toast({
        description: "Project created successfully",
      });
      window.location.reload(); // Reload after successful creation
    } catch (err) {
      console.error("Error creating project:", err);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false); // Stop loading when done
    }
  };

  const allproject = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No access token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/allprojects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching all projects:", err);
      setError("Failed to fetch projects");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Use useEffect to call allproject when the component mounts
  useEffect(() => {
    allproject();
  }, []);
  const deleteproject = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No access token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/deleteproject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
      console.log("Project deleted:", response.data);
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project");
    }
  };

  // when project is created so autorefresh the page

  useEffect(() => {}, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 p-4 flex flex-col border-r-2 border-gray-100">
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
                  <p className="text-sm font-medium leading-none">
                    username{userData?.username}
                  </p>
                  <p className="text-xs leading-none">{userData?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <Link href="/setting">Settings</Link>
                {/* <span>Settings</span> */}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* project create here */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-6">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
              <DialogDescription>
                Deploy your new project in one-click.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createproject}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="projectname">Name</Label>
                  <Input
                    id="projectname"
                    name="projectname"
                    placeholder="Name of your project"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Description of your project"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="language">Language</Label>
                  <Select name="language" required>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="c++">C++</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="javascript">Javascript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Loading Spinner */}
              {isLoading ? (
                <div className="flex justify-center mt-6">
                  <ClipLoader color={"#123abc"} loading={isLoading} size={35} />
                </div>
              ) : (
                <Button type="submit" className="mt-6 ml-24">
                  Create Project
                </Button>
              )}
            </form>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
        {/* side navabar */}
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
    </div>
  );
};

export default Dashboard;
