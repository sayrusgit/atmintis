'use client';

import React, { ChangeEvent, useRef } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { updateEntryImageAction } from '@/lib/actions';

function UpdateEntryImage({ entryId }: { entryId: string }) {
  const router = useRouter();

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleUpdateImage = async (file: File) => {
    const { error } = await updateEntryImageAction(entryId, file);

    if (!error) router.refresh();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) handleUpdateImage(file);
  };

  return (
    <div
      className="flex h-28 min-w-28 cursor-pointer items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-card-hover"
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
