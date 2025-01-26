import React from 'react';
import { IEntry } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import TagsSectionAdd from '@/components/entry/tags-section-add';

function TagsSection({ entry }: { entry: IEntry }) {
  return (
    <div className="mt-sm flex flex-wrap gap-xs">
      {entry.tags?.map((tag) => <Badge key={Date.now() + tag}>{tag}</Badge>)}
      <TagsSectionAdd entryId={entry._id} currentTags={entry.tags} />
    </div>
  );
}

export default TagsSection;
