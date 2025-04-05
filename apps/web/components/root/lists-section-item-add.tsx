'use client';

import React, { useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createListAction } from '@/lib/actions';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'use-intl';
import { ImageIcon } from 'lucide-react';

function ListsSectionItemAdd() {
  const t = useTranslations('root');

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
        <div className="flex h-full cursor-default flex-col justify-between">
          <div className="flex flex-col justify-between gap-xs">
            <Input
              className="w-full"
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
            <Button onClick={handleCreateList} variant="secondary">
              <PlusIcon className="icon-lg h-5 w-5" />
              New collection
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center gap-xs">
          <PlusIcon className="icon-lg" />
          <p className="text-xl leading-5 text-muted-foreground">{t('newCollection')}</p>
        </div>
      )}
    </Card>
  );
}

export default ListsSectionItemAdd;
