import React from 'react';
import type { IEntry } from '@shared/types';
import TagsSectionAdd from '@/components/entry/tags-section-add';
import TagsSectionItem from '@/components/entry/tags-section-item';

function TagsSection({ entry }: { entry: IEntry | null }) {
  return (
    <div className="mt-sm flex flex-wrap gap-xs">
      {entry?.tags?.map((tag) => (
        <TagsSectionItem key={entry._id + tag} entryId={entry._id} tag={tag} />
      ))}
      <TagsSectionAdd entryId={entry?._id} currentTags={entry?.tags} />
    </div>
  );
}

export default TagsSection;
