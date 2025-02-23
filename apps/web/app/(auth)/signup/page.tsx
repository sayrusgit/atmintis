'use client';

import React, { useActionState } from 'react';
import { signup } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { manrope } from '@/styles/fonts';

function Page() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div>
      <h1 className={`text-3xl lg:mt-[160px] ${manrope.className} antialiased`}>Hi there,</h1>
      <h2 className="mb-lg">here you can sign up</h2>
      {state?.message ? (
        <p className="mb-xs h-5 text-sm text-red-400">{state.message}</p>
      ) : (
        <div className="mb-xs h-5"></div>
      )}
      <form action={action} className="flex flex-col gap-md">
        <div className="flex justify-between gap-sm">
          <div className="flex flex-grow flex-col gap-xs">
            <label htmlFor="name">Username</label>
            <Input id="username" name="username" placeholder="Username" />
          </div>
          <div className="flex flex-grow flex-col gap-xs">
            <label htmlFor="name">Email</label>
            <Input id="email" name="email" placeholder="Email" type="email" />
          </div>
        </div>
        <div className="flex flex-col gap-xs">
          <label htmlFor="name">Password</label>
          <Input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            minLength={8}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <div className="flex items-end gap-2">
            <label htmlFor="name">Confirm password</label>
            {state?.passwordError && <p className="text-xs text-red-400">Passwords do not match</p>}
          </div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label htmlFor="file">Profile picture</label>
          <Input
            id="file"
            name="file"
            placeholder="Choose file"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="cursor-pointer"
          />
        </div>
        <Button disabled={pending} type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export default Page;
