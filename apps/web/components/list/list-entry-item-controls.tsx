'use client';

import React from 'react';
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
import { useFetch } from '@/lib/hooks';
import { IList } from '@shared/types';

function ListEntryItemControls({ entryId }: { entryId: string }) {
  const [lists] = useFetch<IList[]>('/lists/get-by-user/:id');

  const handleDelete = async () => {
    await removeEntryAction(entryId);
  };

  const handleMoveTo = async (entryId: string, listId: string) => {
    await reassignEntryAction(entryId, listId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-4 rounded-sm px-3 py-4">
          <DotsVerticalIcon className="icon" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20" align="start" side="left">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ExitIcon className="icon" />
              Move to
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={5}>
                {lists?.map((list) => (
                  <DropdownMenuItem key={list._id} onClick={() => handleMoveTo(entryId, list._id)}>
                    {list.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <Link href={'/entry/edit/' + entryId}>
            <DropdownMenuItem>
              <Pencil1Icon className="icon" />
              Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={handleDelete} className="text-red-400">
            <TrashIcon className="icon text-red-400" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ListEntryItemControls;
