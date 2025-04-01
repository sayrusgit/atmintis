'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons';
import {
  deleteListAction,
  deleteListImage,
  importEntriesAction,
  startExerciseAction,
  updateListImage,
  updateListPrivacyAction,
} from '@/lib/actions';
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
import type { IList, IResponse } from '@shared/types';
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
import { useTranslations } from 'use-intl';

function ListControls({ list, entriesNumber }: { list: IList; entriesNumber: number | undefined }) {
  const t = useTranslations('lists');

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePractice = async () => {
    await startExerciseAction(list._id);
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
    const { error } = await importEntriesAction(list._id, file);

    if (!error) {
      router.refresh();
    }

    setIsOpen(false);
  };

  const handleExport = async () => {
    const { data, error } = await $fetch<IResponse<string>>('/entries/export-list/:id', {
      params: { id: list._id },
    });

    if (!error) startFileDownload(data.response, list.title + '_export.csv');
  };

  const handleUpdateImage = async (file: File) => {
    await updateListImage(list._id, file);

    setIsDialogOpen(false);
  };

  const handleDeleteImage = async () => {
    await deleteListImage(list._id);

    setIsDialogOpen(false);
  };

  return (
    <div className="flex gap-xs">
      <Button onClick={handlePractice} disabled={!entriesNumber}>
        {t('practice')}
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
                  {t('controls.makePublic')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => updateListPrivacyAction(list._id, true)}>
                  <LockIcon />
                  {t('controls.makePrivate')}
                </DropdownMenuItem>
              )}
              <DialogTrigger asChild>
                <DropdownMenuItem disabled={list.isDefault}>
                  <ImageIcon />
                  {t('controls.changeCover.title')}
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuFileItem accept="text/csv" onFileUpload={handleImport}>
                <UploadIcon className="h-4 w-4" />
                {t('controls.import')}
              </DropdownMenuFileItem>
              <DropdownMenuItem onClick={handleExport} disabled={!entriesNumber}>
                <DownloadIcon />
                {t('controls.export')}
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-400"
                    disabled={list.isDefault}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <TrashIcon className="icon text-red-400" />
                    {t('controls.delete')}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('controls.modal.title')} "{list.title}"
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('controls.modal.description')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('controls.modal.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await deleteListAction(list._id);
                        setIsOpen(false);
                      }}
                    >
                      {t('controls.modal.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-medium">
              {t('controls.changeCover.modal.title')}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>{t('controls.changeCover.modal.description')}</DialogDescription>
          <div className="flex justify-between gap-md">
            <FileButton
              className="w-full"
              onFileUpload={handleUpdateImage}
              accept="image/jpeg, image/png, image/webp"
            >
              {t('controls.changeCover.modal.upload')}
            </FileButton>
            <Button
              className="w-full"
              variant="destructive"
              disabled={!list.image}
              onClick={handleDeleteImage}
            >
              {t('controls.changeCover.modal.delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ListControls;
