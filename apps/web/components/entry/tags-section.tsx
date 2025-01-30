import React from 'react';
import { IEntry } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import TagsSectionAdd from '@/components/entry/tags-section-add';
import { XIcon } from 'lucide-react';
import { removeTagFromEntryAction } from '@/lib/actions';
import TagsSectionItem from '@/components/entry/tags-section-item';

function TagsSection({ entry }: { entry: IEntry }) {
  return (
    <div className="mt-sm flex flex-wrap gap-xs">
      {entry.tags?.map((tag) => (
        <TagsSectionItem key={entry._id + tag} entryId={entry._id} tag={tag} />
      ))}
      <TagsSectionAdd entryId={entry._id} currentTags={entry.tags} />
    </div>
  );
}

export default TagsSection;
