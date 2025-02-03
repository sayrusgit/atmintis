'use client';

import React, { useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createListAction } from '@/lib/actions';
import { Card } from '@/components/ui/card';

function ListsSectionItemAdd() {
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState('');

  const handleCreateList = async () => {
    await createListAction(value);
    setIsActive(false);
    setValue('');
  };

  return (
    <Card
      className="min-h-[120px] w-full cursor-pointer rounded-xl border p-sm transition-colors hover:border-border-hover"
      onClick={() => setIsActive(true)}
    >
      {isActive ? (
        <div className="flex h-full flex-col justify-between">
          <div className="flex justify-between gap-sm">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              placeholder="Collection title"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsActive(!isActive);
                  setValue('');
                }
              }}
            />
            <Button onClick={handleCreateList}>+</Button>
          </div>
          <div className="text-sm">Public or private</div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center gap-xs">
          <p className="text-xl leading-5 text-muted-foreground">New collection</p>
          <PlusIcon className="icon-lg" />
        </div>
      )}
    </Card>
  );
}

export default ListsSectionItemAdd;
