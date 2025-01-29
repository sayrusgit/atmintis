'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons';
import { deleteListAction, startListPracticeAction, updateListPrivacyAction } from '@/lib/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuFileItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DownloadIcon, ImageIcon, LockIcon, LockOpenIcon, UploadIcon } from 'lucide-react';
import { startFileDownload } from '@/lib/utils';
import { IList, IResponse } from '@shared/types';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileButton } from '@/components/ui/file-button';
import { $fetch, $put } from '@/lib/fetch';

function ListControls({ list, entriesNumber }: { list: IList; entriesNumber: number | undefined }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePractice = async () => {
    await startListPracticeAction(list._id);
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.code === 'KeyP' && e.shiftKey) handlePractice();
  };

  React.useEffect(() => {
    window.addEventListener('keypress', handleKey);

    return () => {
      window.removeEventListener('keypress', handleKey, false);
    };
  });

  const handleImport = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const { error } = await $put('/entries/import/:id', form, { params: { id: list._id } });

    if (!error) router.refresh();

    setIsOpen(false);
  };

  const handleExport = async () => {
    const { data, error } = await $fetch<IResponse<string>>('/entries/export-list/:id', {
      params: { id: list._id },
    });

    if (!error) startFileDownload(data.response, list.title + '_export.csv');
  };

  const handleUpdateCover = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const { error } = await $put<IResponse<string>>('/lists/image/:id', form, {
      params: { id: list._id },
    });

    setIsDialogOpen(false);

    if (!error) router.refresh();
  };

  return (
    <div className="flex gap-xs">
      <Button onClick={handlePractice} disabled={!entriesNumber}>
        Practice
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <DropdownMenuTrigger asChild>
            <Button size="icon">
              <DotsHorizontalIcon className="icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              {list.isPrivate ? (
                <DropdownMenuItem
                  disabled={list.isDefault}
                  onClick={() => updateListPrivacyAction(list._id, false)}
                >
                  <LockOpenIcon />
                  Make public
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => updateListPrivacyAction(list._id, true)}>
                  <LockIcon />
                  Make private
                </DropdownMenuItem>
              )}
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <ImageIcon />
                  Change cover
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuFileItem accept="text/csv" onFileUpload={handleImport}>
                <UploadIcon className="h-4 w-4" />
                Import
              </DropdownMenuFileItem>
              <DropdownMenuItem onClick={handleExport} disabled={!entriesNumber}>
                <DownloadIcon />
                Export
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-400"
                    disabled={list.isDefault}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <TrashIcon className="icon text-red-400" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to delete "{list.title}"</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the list, as well
                      as all entries inside.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await deleteListAction(list._id);
                        setIsOpen(false);
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-medium">Change cover</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You can either upload a new cover or delete the current one, if it exists
          </DialogDescription>
          <div className="flex justify-between gap-md">
            <FileButton
              className="w-full"
              onFileUpload={handleUpdateCover}
              accept="image/jpeg, image/png, image/webp"
            >
              Upload cover
            </FileButton>
            <Button className="w-full" variant="destructive" disabled={!list.image}>
              Delete cover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ListControls;
