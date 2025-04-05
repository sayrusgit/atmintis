'use client';

import React, { useState } from 'react';
import { updateEntryAction } from '@/lib/actions';

interface Props {
  entryId: string;
  initialValue: string;
}

function EntryDescription({ entryId, initialValue }: Props) {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);

  const handleUpdate = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      await updateEntryAction(entryId, { description: value });

      setEditing(false);
    } else if (e.key === 'Escape') {
      setEditing(false);
      setValue(initialValue);
    }
  };

  return (
    <>
      {editing ? (
        <input
          className="mt-sm h-[18px] animate-pulse bg-background pb-0 pt-0 text-lg leading-none outline-none"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleUpdate}
          autoFocus
        />
      ) : (
        <p className="mt-sm text-lg leading-none" onDoubleClick={() => setEditing(true)}>
          {value}
        </p>
      )}
    </>
  );
}

export default EntryDescription;
