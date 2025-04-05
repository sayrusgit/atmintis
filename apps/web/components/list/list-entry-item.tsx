'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import type { IEntry, IList } from '@shared/types';
import dynamic from 'next/dynamic';
import ListEntryItemControls from '@/components/list/list-entry-item-controls';
import { reassignEntryAction, removeEntryAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';

function ListEntryItem({
  entry,
  isOwner,
  lists,
}: {
  entry: IEntry;
  isOwner: boolean;
  lists: IList[] | null;
}) {
  const [isContextMenuActive, setIsContextMenuActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await removeEntryAction(entry._id);
  };

  const handleMoveTo = async (entryId: string, listId: string) => {
    await reassignEntryAction(entryId, listId);
  };

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
      {!isContextMenuActive ? (
        <Button
          variant="ghost"
          className="w-4 rounded-sm px-3 py-4"
          onClick={() => {
            setIsOpen(true);
            setIsContextMenuActive(true);
          }}
        >
          <DotsVerticalIcon className="icon" />
        </Button>
      ) : (
        isOwner && (
          <ListEntryItemControls
            entry={entry}
            lists={lists}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )
      )}
    </div>
  );
}

export default ListEntryItem;
