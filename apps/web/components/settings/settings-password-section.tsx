'use client';

import React, { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changeUserPasswordAction } from '@/lib/actions';

function SettingsPasswordSection() {
  const [state, action, pending] = useActionState(changeUserPasswordAction, undefined);

  return (
    <form action={action} className="">
      <h3 className="mb-xs text-xl">Password</h3>
      <div className="max-w-80 space-y-xs">
        <Input
          placeholder="Old password"
          id="oldPassword"
          name="oldPassword"
          type="password"
          variant="filled"
        />
        <Input
          placeholder="New password"
          id="newPassword"
          name="newPassword"
          type="password"
          variant="filled"
        />
        <Input
          placeholder="Confirm new password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          variant="filled"
        />
        {state?.passwordError && <p className="text-sm text-red-400">Passwords do no match</p>}
      </div>
      <div className="mt-md flex items-center gap-md">
        <Button type="submit" disabled={pending}>
          Change password
        </Button>
        {state?.success ? (
          <p className="text-sm text-success">{state.message}</p>
        ) : (
          <p className="text-sm text-danger">{state?.message}</p>
        )}
      </div>
    </form>
  );
}

export default SettingsPasswordSection;
