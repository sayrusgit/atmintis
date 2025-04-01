'use client';

import React, { lazy, useCallback, useState } from 'react';
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

function ListEntryControls({ entry, lists }: { entry: IEntry; lists: IList[] | null }) {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-4 rounded-sm px-3 py-4">
          <DotsVerticalIcon className="icon" />
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}

export default React.memo(ListEntryControls);
