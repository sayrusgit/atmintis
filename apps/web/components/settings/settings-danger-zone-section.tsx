'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { IUser } from '@shared/types';
import { Input } from '@/components/ui/input';
import { deleteUserAction } from '@/lib/actions';

function SettingsDangerZoneSection({ user }: { user: IUser | null }) {
  const [value, setValue] = useState('');

  return (
    <Card className="mt-md p-md pt-md">
      <h2 className="mb-sm text-2xl leading-none">Danger zone</h2>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data. If this is a deliberate decision, type your email down below:
            </AlertDialogDescription>
            <div>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-xs"
                placeholder={user?.email}
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={user?.email !== value} onClick={deleteUserAction}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default SettingsDangerZoneSection;
