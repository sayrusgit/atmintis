'use client';

import React, { ChangeEvent, useActionState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IResponse, IUser } from '@shared/types';
import { $put } from '@/lib/fetch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { finalizeEmailVerification } from '@/lib/actions';
import SettingsProfileSectionSend from '@/components/settings/settings-profile-section-send';
import { STATIC_URL } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

function SettingsProfileSection({ user }: { user: IUser | null }) {
  const router = useRouter();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [state, action] = useActionState(finalizeEmailVerification, undefined);

  const handleUpdateImage = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const res = await $put<IResponse<any>>('/users/update-picture/:id', form, {
      params: { id: user?._id },
    });

    if (!res.error) router.refresh();
  };

  return (
    <Card className="mt-md p-md pt-md">
      <h2 className="mb-sm text-2xl leading-none">Profile</h2>
      <div className="flex items-start gap-md">
        <div className="relative min-w-40">
          {user?.profilePicture ? (
            <Image
              src={STATIC_URL + '/images/' + user?.profilePicture}
              alt="Profile picture"
              width={160}
              height={160}
              className="h-40 w-40 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-secondary">
              <UserCircle className="h-12 w-12" strokeWidth={1} />
            </div>
          )}
          <div
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 left-0 w-full cursor-pointer rounded-b-lg bg-black/65 p-1 text-center text-sm opacity-0 transition-opacity hover:opacity-100"
          >
            Change
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              ref={fileRef}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files![0];
                if (file) handleUpdateImage(file);
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-xs">
          <div>
            <p className="text-xs">Username</p>
            <p className="font-medium text-foreground-heading">{user?.username}</p>
          </div>
          <div>
            <p className="text-xs">Email</p>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground-heading">{user?.email}</p>
              {user?.isEmailVerified ? (
                <span className="text-sm text-success">Verified</span>
              ) : (
                <span className="text-sm text-red-400">Unverified</span>
              )}
            </div>
            {!user?.isEmailVerified && (
              <Dialog>
                <DialogTrigger className="mt-xs rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80">
                  Verify
                </DialogTrigger>
                <DialogContent className="gap-md">
                  <DialogHeader>
                    <DialogTitle>Email verification</DialogTitle>
                    <DialogDescription>
                      We sent a verification code to your email. If it wasn't delivered, check Spam
                      folder or click the "Resend" button below.
                    </DialogDescription>
                  </DialogHeader>
                  <form action={action}>
                    <div className="mb-md flex justify-between gap-sm">
                      <Input
                        id="code"
                        name="code"
                        placeholder={'Enter verification code'}
                        maxLength={6}
                      />
                      <SettingsProfileSectionSend />
                    </div>
                    <div className="flex items-center gap-xs">
                      <Button type="submit">Verify</Button>
                      {state?.codeError && <p className="text-sm text-red-400">Invalid code</p>}
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SettingsProfileSection;
