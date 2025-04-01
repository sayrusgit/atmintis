'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { deleteEntryImageAction } from '@/lib/actions';
import UpdateEntryImage from '@/components/entry/update-entry-image';
import type { IEntry } from '@shared/types';

function EntryImageSection({ entry }: { entry: IEntry }) {
  if (!entry.image) return <UpdateEntryImage entryId={entry._id} />;

  return (
    <div className="group relative">
      <Image
        src={entry.image}
        className="h-28 min-w-28 rounded-xl bg-secondary object-cover transition-opacity group-hover:opacity-65"
        height={112}
        width={112}
        alt="entry image"
      />
      <div className="pointer-events-none absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <X
          className="pointer-events-auto h-4 w-4 cursor-pointer drop-shadow"
          onClick={() => deleteEntryImageAction(entry._id)}
        />
      </div>
    </div>
  );
}

export default EntryImageSection;
