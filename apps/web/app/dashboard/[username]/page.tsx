"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { ToastAction } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
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
          `http://localhost:3006/api/v1/user/dashboard/${username}`,
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
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3006/api/v1/createproject",
        {
          projectname: formData.get("projectname"),
          description: formData.get("description"),
          language: formData.get("language"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      console.log("Project created:", response.data);
      toast({
        description: "project created successfully",
      });
    } catch (err) {
      console.error("Error creating project:", err);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
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
        "http://localhost:3006/api/v1/allprojects",
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
        `http://localhost:3006/api/v1/deleteproject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Project deleted:", response.data);
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project");
    }
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
                  <p className="text-sm font-medium leading-none">
                    username{userData?.username}
                  </p>
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
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Description of your project"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="language">Language</Label>
                  <Select name="language">
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
              <Button type="submit" className="mt-6 ml-24">
                Create Project
              </Button>
            </form>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>

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
          <ModeToggle />
        </header>
        <main className="container mx-auto p-4 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-6">
            Project Dashboard
          </h1>
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-1/2 lg:mx-auto">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <AnimatePresence>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="h-[250px]">
                        <CardHeader>
                          <Skeleton className="h-6 w-2/3" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-4/6" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-4 w-1/2" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-center"
                  >
                    {error}
                  </motion.p>
                ) : projects.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {projects.map((project) => (
                      <motion.div key={project.id} variants={itemVariants}>
                        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="flex justify-between items-start">
                            <div className="flex justify-evenly">
                              <CardTitle className="text-xl font-semibold truncate">
                                {project.projectname}
                              </CardTitle>
                              <AlertDialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none">
                                      <MoreVertical className="h-5 w-5" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete your project.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteproject(project.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                              {project.description}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center text-xs text-gray-500">
                            <div className="flex items-center">
                              <Code className="w-4 h-4 mr-1" />
                              {project.language}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-500"
                  >
                    No projects found.
                  </motion.p>
                )}
              </AnimatePresence>
            </TabsContent>
            <TabsContent value="recent">
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Your recent projects will appear here.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shared">
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Projects shared with you will appear here.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
