'use client';

import React, { useState } from 'react';
import { manrope } from '@/styles/fonts';
import { updateEntryAction } from '@/lib/actions';

interface Props {
  entryId: string;
  initialValue: string;
}

function EntryValue({ entryId, initialValue }: Props) {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);

  const handleUpdate = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      await updateEntryAction(entryId, { value: value });

      setEditing(false);
    } else if (e.key === 'Escape') {
      setEditing(false);
      setValue(initialValue);
    }
  };

  return (
    <div>
      {editing ? (
        <input
          className={`${manrope.className} animate-pulse text-balance bg-background p-0 text-4xl outline-none`}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleUpdate}
          autoFocus
        />
      ) : (
        <h1
          className={`${manrope.className} text-balance text-4xl`}
          onDoubleClick={() => setEditing(true)}
        >
          {value}
        </h1>
      )}
    </div>
  );
}

export default EntryValue;
