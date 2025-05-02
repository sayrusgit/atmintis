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
import { HeaderNewListSelect } from '@/components/header-new-list-select';
import type { CreateEntryDto } from '@/lib/dto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createEntryAction } from '@/lib/actions';
import type { IList, IUser } from '@shared/types';
import { useTranslations } from 'use-intl';

const HeaderNew = ({ lists }: { lists: IList[] | null; user: IUser }) => {
  const t = useTranslations('header');

  const drawerRef = useRef<HTMLButtonElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<CreateEntryDto>({
    value: '',
    description: '',
    type: '',
    list: '',
  });

  const handleCreate = async () => {
    await createEntryAction({ ...data });

    setData({ value: '', description: '', type: '' });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOpen = (e: KeyboardEvent) => {
      if (e.key === '/' && e.ctrlKey) {
        drawerRef.current?.click();
      }
    };

    const handlePressingCreate = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') handleCreate();
    };

    window.addEventListener('keydown', handleOpen);
    window.addEventListener('keydown', handlePressingCreate);

    return () => {
      window.removeEventListener('keydown', handleOpen);
      window.removeEventListener('keydown', handlePressingCreate);
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
            <div className="hover:bg-hover flex h-10 cursor-pointer items-center rounded-md border pr-1 pl-3 text-sm font-medium transition-colors sm:pr-4">
              <PlusIcon className="mr-2 h-5" />
              <span className="hidden sm:block">{t('New.button')}</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            className="w-full rounded-sm border-none bg-black/40 p-1 px-3"
            sideOffset={10}
            side="left"
          >
            <kbd className="text-xs leading-none">Ctrl + /</kbd>
          </HoverCardContent>
        </HoverCard>
      </DrawerTrigger>
      <DrawerContent className="outline-0">
        <div className="mx-auto w-full max-w-[615px]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-xl">{t('New.form.title')}</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-5 p-4">
            <div className="gap-sm flex flex-col items-center justify-between md:flex-row">
              <Input
                value={data.value}
                onChange={(e) => setData({ ...data, value: e.target.value })}
                placeholder={t('New.form.entryPlaceholder')}
                className="hover:bg-input-hover"
                autoFocus
              />
              <Input
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder={t('New.form.descriptionPlaceholder')}
                className="hover:bg-input-hover"
              />
              <Select onValueChange={(value) => setData({ ...data, type: value })}>
                <SelectTrigger className="bg-background! hover:bg-input-hover! w-full md:w-[330px]">
                  <SelectValue placeholder={t('New.form.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noun">{t('New.form.types.noun')}</SelectItem>
                  <SelectItem value="adjective">{t('New.form.types.adjective')}</SelectItem>
                  <SelectItem value="verb">{t('New.form.types.verb')}</SelectItem>
                  <SelectItem value="adverb">{t('New.form.types.adverb')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <HeaderNewListSelect lists={lists} setList={setList} />
          </div>
          <DrawerFooter className="pb-lg">
            <div className="gap-md flex">
              <Button onClick={() => handleCreate()} className="w-full">
                {t('New.form.submit')}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  {t('New.form.cancel')}
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default HeaderNew;
