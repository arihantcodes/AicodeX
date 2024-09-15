"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

const LoginForm = () => {

    const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      username: form.get("username"),
      email: form.get("email"),
      password: form.get("password"),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signup`,
        data
      );
      router.push('/dashboard');
      toast.success('Account created successfully');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Account creation failed');
    }
  };

  return (
    <div>
      <Navbar />
      <Card className="mx-auto max-w-sm mt-24 mb-10">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
         
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="aicodex"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="aicodex@arihant.us"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
};

export default LoginForm;
