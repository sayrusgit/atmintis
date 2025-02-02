'use client';

import React, { useActionState, useState } from 'react';
import { signin } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { manrope } from '@/styles/fonts';
import Link from 'next/link';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

function Page() {
  const [state, action, pending] = useActionState(signin, undefined);
  const [data, setData] = useState({ login: '', password: '' });

  if (state?.mfa)
    return (
      <div>
        <h1 className="text-center text-xl lg:mt-[160px]">MFA Authentication</h1>
        <form action={action} className="mt-xl flex flex-col items-center justify-center gap-md">
          <input id="login" name="login" defaultValue={data.login} className="hidden" />
          <input id="password" name="password" defaultValue={data.password} className="hidden" />
          <InputOTP
            maxLength={6}
            autoFocus
            pattern={REGEXP_ONLY_DIGITS}
            id="mfaCode"
            name="mfaCode"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button disabled={pending} type="submit" tabIndex={3}>
            Sign In
          </Button>
        </form>
      </div>
    );

  return (
    <div>
      <h1 className={`text-3xl lg:mt-[160px] ${manrope.className} antialiased`}>Welcome back,</h1>
      <h2>here you can sign in</h2>
      <form action={action} className="mt-xl flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <div className="flex items-end gap-xs">
            <label htmlFor="login">Login</label>
            {state?.loginMessage && <p className="text-xs text-red-400">{state.loginMessage}</p>}
          </div>
          <Input
            id="login"
            name="login"
            placeholder="Username or email"
            tabIndex={1}
            value={data.login}
            onChange={(e) => setData({ ...data, login: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-xs">
              <label htmlFor="name">Password</label>
              {state?.passwordMessage && (
                <p className="text-xs text-red-400">{state.passwordMessage}</p>
              )}
            </div>
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
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <Button disabled={pending} type="submit" tabIndex={3}>
          Sign In
        </Button>
      </form>
      <p className="mt-xs text-sm">
        Don’t have an account yet?{' '}
        <Link href="/signup" className="text-accent">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Page;
