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
import { CreateEntryContextDto, CreateEntryDto } from '@/lib/dto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createEntryAction } from '@/lib/actions';
import { IList, IUser } from '@shared/types';

const NewEntry = ({ lists }: { lists: IList[]; user: IUser }) => {
  const drawerRef = useRef<HTMLButtonElement | null>(null);
  const [data, setData] = useState<CreateEntryDto>({
    value: '',
    description: '',
    type: '',
    list: '',
  });
  const [entryContext, setEntryContext] = useState<CreateEntryContextDto>({
    value: '',
    color: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === '/' && e.ctrlKey) {
      drawerRef.current?.click();
    }
  };

  const handleCreate = async () => {
    if (!data.value || !data.description) return;

    const res = await createEntryAction({
      ...data,
      context: entryContext.value ? entryContext : undefined,
    });

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
              New
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
            <DrawerTitle>New entry</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-5 p-4">
            <div className="flex flex-col items-center justify-between gap-sm md:flex-row">
              <Input
                value={data.value}
                onChange={(e) => setData({ ...data, value: e.target.value })}
                placeholder="Entry title"
                autoFocus
              />
              <Input
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Entry description"
              />
              <Select onValueChange={(value) => setData({ ...data, type: value })}>
                <SelectTrigger className="w-full md:w-[330px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noun">Noun</SelectItem>
                  <SelectItem value="adjective">Adjective</SelectItem>
                  <SelectItem value="verb">Verb</SelectItem>
                  <SelectItem value="adverb">Adverb</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/*<div className="flex justify-between gap-sm">*/}
            {/*  <Select onValueChange={(value) => setEntryContext({ ...entryContext, color: value })}>*/}
            {/*    <SelectTrigger className="w-[300px]">*/}
            {/*      <SelectValue placeholder="Context color" />*/}
            {/*    </SelectTrigger>*/}
            {/*    <SelectContent>*/}
            {/*      <SelectItem value="ca5353" className="text-[#ca5353] focus:text-[#ca5353]">*/}
            {/*        Red*/}
            {/*      </SelectItem>*/}
            {/*      <SelectItem value="3373bd" className="text-[#3a9f69] focus:text-[#3a9f69]">*/}
            {/*        Green*/}
            {/*      </SelectItem>*/}
            {/*      <SelectItem value="3a9f69" className="text-[#3373bd] focus:text-[#3373bd]">*/}
            {/*        Blue*/}
            {/*      </SelectItem>*/}
            {/*    </SelectContent>*/}
            {/*  </Select>*/}
            {/*  <Input*/}
            {/*    placeholder="Context"*/}
            {/*    value={entryContext.value}*/}
            {/*    onChange={(e) => setEntryContext({ ...entryContext, value: e.target.value })}*/}
            {/*  />*/}
            {/*</div>*/}
            <NewEntryListSelect lists={lists} setList={setList} />
          </div>
          <DrawerFooter className="pb-lg">
            <div className="flex gap-md">
              <Button onClick={() => handleCreate()} className="w-full">
                Create
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
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
