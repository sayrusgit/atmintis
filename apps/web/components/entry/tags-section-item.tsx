'use client';

import React from 'react';
import { XIcon } from 'lucide-react';
import { removeTagFromEntryAction } from '@/lib/actions';
import { Badge } from '@/components/ui/badge';

function TagsSectionItem({ entryId, tag }: { entryId: string; tag: string }) {
  return (
    <Badge className="relative">
      {tag}
      <XIcon
        className="absolute right-0 top-0 h-[100%] w-[25%] cursor-pointer rounded-r-xl bg-muted-foreground opacity-0 transition-opacity hover:opacity-100"
        onClick={() => removeTagFromEntryAction(entryId, tag)}
      />
    </Badge>
  );
}

export default TagsSectionItem;
