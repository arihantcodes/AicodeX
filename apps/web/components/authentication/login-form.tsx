'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAnonymousLogin = async () => {
    // Implement guest login logic here
    toast({
      title: "Guest Login",
      description: "Logging in as a guest...",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { email, password };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signin`,
        data
      );

      const { user, accessToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      router.push(`/dashboard/${user.username}`);

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
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
          <Label className="text-muted-foreground leading-2" htmlFor="email">
            Email address
          </Label>
          <Input
            className="border-border rounded-xs"
            type="email"
            id="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" variant="default" className="w-full">
        Log in
      </Button>
    </form>
  );
}