'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { NewEntryListSelect } from '@/components/new-lentry-list-select';
import { CreateEntryDto } from '@/lib/dto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createEntryAction } from '@/lib/actions';
import { IList, IUser } from '@shared/types';
import { useTranslations } from 'use-intl';

const NewEntry = ({ lists }: { lists: IList[] | null; user: IUser }) => {
  const t = useTranslations('header');

  const drawerRef = useRef<HTMLButtonElement | null>(null);
  const [data, setData] = useState<CreateEntryDto>({
    value: '',
    description: '',
    type: '',
    list: '',
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === '/' && e.ctrlKey) {
      drawerRef.current?.click();
    }
  };

  const handleCreate = async () => {
    await createEntryAction({ ...data });

    setData({ value: '', description: '', type: '' });
    setIsOpen(false);
  };

  const handlePressingCreate = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleCreate();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handlePressingCreate);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keypress', handlePressingCreate);
    };
  }, []);

  const setList = (listId: string) => {
    setData({ ...data, list: listId });
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(e) => {
        setData({ value: '', description: '', type: '' });
        setIsOpen(e);
      }}
    >
      <DrawerTrigger ref={drawerRef}>
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="flex h-10 cursor-pointer items-center rounded-md border pl-3 pr-4 text-sm font-medium transition-colors hover:bg-accent">
              <PlusIcon className="mr-2 h-5 w-5" />
              {t('NewEntry.button')}
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            className="w-25 rounded-sm border-none bg-black bg-opacity-40 p-1 px-3"
            sideOffset={10}
            side="left"
          >
            <kbd className="text-xs leading-none">Ctrl + /</kbd>
          </HoverCardContent>
        </HoverCard>
      </DrawerTrigger>
      <DrawerContent className="outline-0">
        <div className="mx-auto w-full max-w-[615px]">
          <DrawerHeader>
            <DrawerTitle>{t('NewEntry.title')}</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-5 p-4">
            <div className="flex flex-col items-center justify-between gap-sm md:flex-row">
              <Input
                value={data.value}
                onChange={(e) => setData({ ...data, value: e.target.value })}
                placeholder={t('NewEntry.form.entryPlaceholder')}
                autoFocus
              />
              <Input
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder={t('NewEntry.form.descriptionPlaceholder')}
              />
              <Select onValueChange={(value) => setData({ ...data, type: value })}>
                <SelectTrigger className="w-full md:w-[330px]">
                  <SelectValue placeholder={t('NewEntry.form.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noun">{t('NewEntry.form.types.noun')}</SelectItem>
                  <SelectItem value="adjective">{t('NewEntry.form.types.adjective')}</SelectItem>
                  <SelectItem value="verb">{t('NewEntry.form.types.verb')}</SelectItem>
                  <SelectItem value="adverb">{t('NewEntry.form.types.adverb')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <NewEntryListSelect lists={lists} setList={setList} />
          </div>
          <DrawerFooter className="pb-lg">
            <div className="flex gap-md">
              <Button onClick={() => handleCreate()} className="w-full">
                {t('NewEntry.form.submit')}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  {t('NewEntry.form.cancel')}
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewEntry;
