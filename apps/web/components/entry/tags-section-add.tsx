'use client';

import React, { useState, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { addTagToEntryAction } from '@/lib/actions';

function TagsSectionAdd({
  entryId,
  currentTags,
}: {
  entryId: string | undefined;
  currentTags: string[] | undefined;
}) {
  const [tag, setTag] = useState('');

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    const updatedTags = currentTags?.length ? [...currentTags] : [];
    updatedTags.push(tag);

    if (e.code === 'Enter' && entryId) {
      addTagToEntryAction(entryId, updatedTags);
      setTag('');
    }
  };

  return (
    <Input
      className="h-5 w-20 cursor-pointer border border-dashed border-zinc-500 bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground"
      placeholder="Add tag"
      value={tag}
      onChange={(e) => setTag(e.target.value)}
      onKeyDown={(e) => handleEnter(e)}
    />
  );
}

export default TagsSectionAdd;
