'use client';

import React, { ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IResponse, IUser } from '@shared/types';
import { $put } from '@/lib/fetch';

function SettingsProfileSection({ user }: { user: IUser | null }) {
  const router = useRouter();

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleUpdateImage = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const res = await $put<IResponse<any>>('/users/update-picture/:id', form, {
      params: { id: user?._id },
    });

    if (!res.error) router.refresh();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) handleUpdateImage(file);
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
        <Button onClick={() => fileUploadRef.current?.click()}>
          Change profile picture
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png, image/webp"
            ref={fileUploadRef}
            onChange={handleFileChange}
          />
        </Button>
      </div>
      <div className="flex w-full flex-col gap-sm">
        <div>
          <p className="text-sm">Username</p>
          <p className="text-xl font-medium">{user?.username}</p>
        </div>
        <div>
          <p className="text-sm">Email</p>
          <p className="text-xl font-medium">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsProfileSection;
