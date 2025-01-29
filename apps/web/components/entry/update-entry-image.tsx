'use client';

import React, { ChangeEvent, useRef } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { IResponse } from '@shared/types';
import { $put } from '@/lib/fetch';

function UpdateEntryImage({ entryId }: { entryId: string }) {
  const router = useRouter();

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleUpdateImage = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const { error } = await $put<IResponse<any>>('entries/image/:id', form, {
      params: { id: entryId },
    });

    if (!error) router.refresh();
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
      {/*TODO: create a fileimage component, then insert it here and in settings*/}
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
