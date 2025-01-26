'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons';
import { deleteListAction, startListPracticeAction, updateListPrivacyAction } from '@/lib/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DownloadIcon, ImageIcon, LockIcon, LockOpenIcon, UploadIcon } from 'lucide-react';
import { get } from '@/lib/neofetch';
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

function ListControls({ list, entriesNumber }: { list: IList; entriesNumber: number }) {
  const router = useRouter();

  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const coverUploadRef = useRef<HTMLInputElement | null>(null);

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

    const res = await fetch('http://localhost:5000/api/entries/import/' + list._id, {
      credentials: 'include',
      method: 'PUT',
      body: form,
    });

    if (res.ok) router.refresh();

    setIsOpen(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) handleImport(file);
  };

  const handleExport = async () => {
    const { success, response: csvData } = await get<IResponse<string>>(
      'entries/export-list/' + list._id,
    );

    if (success) startFileDownload(csvData, list.title + '_export.csv');
  };

  const handleUpdateCover = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('http://localhost:5000/api/lists/image/' + list?._id, {
      credentials: 'include',
      method: 'PUT',
      body: form,
    });

    setIsDialogOpen(false);

    if (res.ok) router.refresh();
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) handleUpdateCover(file);
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
            {/* TODO make a file upload child for dropdown menu*/}
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
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => fileUploadRef.current!.click()}
                className="flex cursor-pointer items-center gap-[.5rem] rounded-xs px-2 py-[6px] text-sm transition-colors hover:bg-secondary"
              >
                <UploadIcon className="h-4 w-4" />
                Import
                <input
                  type="file"
                  className="h-0 w-0"
                  accept="text/csv"
                  ref={fileUploadRef}
                  onChange={handleFileChange}
                  onAbort={() => setIsOpen(false)}
                />
              </DropdownMenuItem>
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
            <Button className="w-full" onClick={() => coverUploadRef.current?.click()}>
              Upload cover
              <input
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                ref={coverUploadRef}
                onChange={handleCoverChange}
              />
            </Button>
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
