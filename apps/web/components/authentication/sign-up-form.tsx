'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ToastAction } from '@/components/ui/toast';

export function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleAnonymousLogin = async () => {
    // Implement guest login logic here
    toast({
      title: "Guest Login",
      description: "Logging in as a guest...",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );
     
      router.push(`/signin`);
      toast({
        description: "Account created successfully.",
      });
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Account creation failed.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center">
      <Image src="/assets/icons/logo/aeroedit-icon.svg" alt="AeroEdit" width={80} height={80} />
      <div className="text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center">
        Log in to your account
      </div>
      <Button onClick={handleAnonymousLogin} type="button" variant="secondary" className="w-full mt-6">
        Log in as Guest
      </Button>
      <div className="flex w-full items-center justify-center">
        <Separator className="w-5/12 bg-border" />
        <div className="text-border text-xs font-medium px-4">or</div>
        <Separator className="w-5/12 bg-border" />
      </div>
      <div className="w-full space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-muted-foreground leading-2" htmlFor="username">
            Username
          </Label>
          <Input
            className="border-border rounded-xs"
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-muted-foreground leading-2" htmlFor="email">
            Email address
          </Label>
          <Input
            className="border-border rounded-xs"
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-muted-foreground leading-2" htmlFor="password">
            Password
          </Label>
          <Input
            className="border-border rounded-xs"
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <Button type="submit" variant="default" className="w-full">
        Create Account
      </Button>
    </form>
  );
}