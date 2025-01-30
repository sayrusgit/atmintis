'use client';

import React, { useActionState } from 'react';
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
import { FileButton } from '@/components/ui/file-button';
import { finalizeEmailVerification } from '@/lib/actions';
import SettingsProfileSectionSend from '@/components/settings/settings-profile-section-send';

function SettingsProfileSection({ user }: { user: IUser | null }) {
  const router = useRouter();

  const [state, action, pending] = useActionState(finalizeEmailVerification, undefined);

  const handleUpdateImage = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const res = await $put<IResponse<any>>('/users/update-picture/:id', form, {
      params: { id: user?._id },
    });

    if (!res.error) router.refresh();
  };

  return (
    <div className="flex items-start gap-md">
      <div className="flex flex-col gap-sm">
        <Image
          src={'http://localhost:5000/static/images/' + user?.profilePicture}
          alt="Profile picture"
          width={181}
          height={181}
          className="h-[181px] w-[181px] rounded-xl object-cover"
        />
        <FileButton onFileUpload={handleUpdateImage} accept="image/jpeg, image/png, image/webp">
          Change profile picture
        </FileButton>
      </div>
      <div className="flex w-full flex-col gap-md">
        <div className="flex gap-md">
          <div>
            <p className="text-sm">Username</p>
            <p className="text-xl font-medium">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm">Email</p>
            <p className="text-xl font-medium">{user?.email}</p>
          </div>
        </div>
        <div>
          <p className="text-sm">Email verification</p>
          <p className="mb-xs text-xl font-medium">
            {user?.isEmailVerified ? (
              <span className="text-success">Verified</span>
            ) : (
              <span className="text-red-400">Unverified</span>
            )}
          </p>
          {!user?.isEmailVerified && (
            <Dialog>
              <DialogTrigger className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80">
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
  );
}

export default SettingsProfileSection;
