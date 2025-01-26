'use client';

import React, { useRef, useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createListAction } from '@/lib/actions';

function ListsSectionItemAdd() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState('');

  const handleCreateList = async () => {
    await createListAction(value);
    setIsActive(false);
    setValue('');
  };

  return (
    <div
      className="h-36 w-full cursor-pointer rounded-xl border p-md transition-colors hover:bg-secondary"
      onClick={() => setIsActive(true)}
    >
      {isActive ? (
        <div className="flex h-full flex-col justify-between">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            ref={inputRef}
            placeholder="List title"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsActive(!isActive);
                setValue('');
              }
            }}
          />
          <Button onClick={handleCreateList}>Create</Button>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center gap-xs">
          <p className="text-xl leading-5 text-muted-foreground">Add list</p>
          <PlusIcon className="icon-lg" />
        </div>
      )}
    </div>
  );
}

export default ListsSectionItemAdd;
