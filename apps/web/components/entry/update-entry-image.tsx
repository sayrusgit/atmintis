'use client';

import React, { ChangeEvent, useRef } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { put } from '@/lib/neofetch';
import { IResponse } from '@shared/types';

function UpdateEntryImage({ entryId }: { entryId: string }) {
  const router = useRouter();

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleUpdateImage = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const res = await put<IResponse<any>>('entries/image/' + entryId, form, true);

    if (res.success) router.refresh();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) handleUpdateImage(file);
  };

  return (
    <div
      className="flex h-28 min-w-28 cursor-pointer items-center justify-center rounded-xl bg-accent transition-colors hover:bg-accent/60"
      onClick={() => fileUploadRef.current!.click()}
    >
      <PlusIcon className="icon-lg" />
      <input
        type="file"
        className="h-0 w-0"
        accept="image/jpeg, image/png, image/webp"
        ref={fileUploadRef}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default UpdateEntryImage;
