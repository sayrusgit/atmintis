import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import type { IEntry, IList } from '@shared/types';
import ListEntryItemControls from '@/components/list/list-entry-item-controls';

function ListEntryItem({
  entry,
  isOwner,
  lists,
}: {
  entry: IEntry;
  isOwner: boolean;
  lists: IList[] | null;
}) {
  return (
    <div key={entry._id} className="flex items-center justify-between py-2">
      <Link
        href={isOwner ? `/entry/${entry._id}` : '/'}
        className="w-full rounded-sm transition-colors hover:bg-card-hover"
      >
        <div className="flex h-auto items-center justify-between px-2 py-1">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground-heading">{entry.value}</p>
              <p className="font mt-1 text-xs text-muted-foreground">{entry.type}</p>
            </div>
            <p className="text-wrap break-words text-sm">{entry.description}</p>
          </div>
          <ChevronRightIcon className="icon justify-self-end" />
        </div>
      </Link>
      {isOwner && <ListEntryItemControls entry={entry} lists={lists} />}
    </div>
  );
}

export default ListEntryItem;
