'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsVerticalIcon, ExitIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { removeEntryAction } from '@/lib/actions';
import Link from 'next/link';

function ListEntryItemControls({ entryId }: { entryId: string }) {
  const handleDelete = async () => {
    await removeEntryAction(entryId);
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
          <DropdownMenuItem>
            <ExitIcon className="icon" />
            Move to
          </DropdownMenuItem>
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
