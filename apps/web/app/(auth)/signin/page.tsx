'use client';

import React, { useActionState } from 'react';
import { signin } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { manrope } from '@/styles/fonts';
import Link from 'next/link';

function Page() {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <div>
      <h1 className={`text-3xl lg:mt-[160px] ${manrope.className} antialiased`}>Welcome back,</h1>
      <h2>here you can sign in</h2>
      <form action={action} className="mt-xl flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <label htmlFor="name">Username</label>
          <Input id="username" name="username" placeholder="Username" tabIndex={1} />
        </div>
        <div className="flex flex-col gap-xs">
          <div className="flex justify-between">
            <label htmlFor="name">Password</label>
            <Link href="/" className="text-sm text-muted-foreground">
              Restore password
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            tabIndex={2}
          />
        </div>
        <Button disabled={pending} type="submit" tabIndex={3}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export default Page;
