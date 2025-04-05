'use client';

import React, { type Dispatch, lazy, useCallback, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsVerticalIcon, ExitIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { reassignEntryAction, removeEntryAction } from '@/lib/actions';
import Link from 'next/link';
import { useTranslations } from 'use-intl';
import type { IEntry, IList } from '@shared/types';

type Props = {
  entry: IEntry;
  lists: IList[] | null;
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

function ListEntryItemControls({ entry, lists, isOpen, setIsOpen }: Props) {
  const t = useTranslations('lists');

  const handleDelete = useCallback(async () => {
    await removeEntryAction(entry._id);
  }, [entry, lists]);

  const handleMoveTo = useCallback(
    async (entryId: string, listId: string) => {
      await reassignEntryAction(entryId, listId);
    },
    [entry, lists],
  );

  return (
    <DropdownMenu open={isOpen}>
      <DropdownMenuTrigger asChild onClick={() => setIsOpen(!isOpen)} data-state={isOpen}>
        <Button variant="ghost" className="w-4 rounded-sm px-3 py-4">
          <DotsVerticalIcon className="icon" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-20"
        align="start"
        side="left"
        onInteractOutside={() => setIsOpen(false)}
        onEscapeKeyDown={() => setIsOpen(false)}
        onFocusOutside={() => setIsOpen(false)}
      >
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ExitIcon className="icon" />
              {t('item.controls.move')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={5}>
                {lists?.map((list) => (
                  <DropdownMenuItem
                    key={list._id}
                    onClick={() => handleMoveTo(entry._id, list._id)}
                    disabled={list._id === entry.list}
                  >
                    {list.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <Link href={'/entry/edit/' + entry._id}>
            <DropdownMenuItem>
              <Pencil1Icon className="icon" />
              {t('item.controls.edit')}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={handleDelete} className="text-red-400">
            <TrashIcon className="icon text-red-400" />
            {t('item.controls.delete')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default React.memo(ListEntryItemControls);
