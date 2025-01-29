'use client';

import React, { ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IResponse, IUser } from '@shared/types';
import { $put } from '@/lib/fetch';

function SettingsProfilePicture({ user }: { user: IUser | null }) {
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
  );
}

export default SettingsProfilePicture;
