'use client';

import React from 'react';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { ExitIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useTranslations } from 'use-intl';
import type { IEntry, IList } from '@shared/types';

type Props = {
  entry: IEntry;
  lists: IList[] | null;
  handleDelete: () => Promise<void>;
  handleMoveTo: (entryId: string, listId: string) => Promise<void>;
};

function ListEntryControlsContent({ entry, lists, handleDelete, handleMoveTo }: Props) {
  const t = useTranslations('lists');

  return (
    <DropdownMenuContent className="w-20" align="start" side="left">
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
  );
}

export default React.memo(ListEntryControlsContent);
