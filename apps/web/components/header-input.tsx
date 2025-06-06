'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input-icons';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { IEntry } from '@shared/types';
import { useDebouncedCallback } from '@/lib/hooks';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'use-intl';
import { $fetch } from '@/lib/fetch';

export default function HeaderInput({ userId }: { userId: string }) {
  const t = useTranslations('header');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<IEntry[] | null>(null);

  const performSearch = useDebouncedCallback(async (searchTerm: string) => {
    const { data } = await $fetch<IEntry[]>('/entries/search-query/:searchTerm?userId=' + userId, {
      params: {
        searchTerm,
      },
    });
    console.log(data);
    setSearchSuggestions(data);
  }, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value);
    performSearch(event.currentTarget.value);
  };

  return (
    /*TODO rewrite ml-5 to proper grid implementation*/
    <div className="w-full max-w-[605px] md:ml-6">
      <Input
        placeholder={t('SearchPlaceholder')}
        value={searchTerm}
        onChange={(e) => handleChange(e)}
        className="w-full max-w-[605px]"
      >
        <Input.Icon side="left">
          <MagnifyingGlassIcon />
        </Input.Icon>
      </Input>
      {/*<Input
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => handleChange(e)}
        className="w-full max-w-[605px]"
      />*/}
      <Card
        hidden={!searchSuggestions?.length}
        className="bg-background p-xs absolute top-[70px] w-full max-w-[605px] rounded-md border"
      >
        {searchSuggestions?.length &&
          searchSuggestions.map((suggestion) => (
            <Link
              href={`/entry/${suggestion._id}`}
              key={suggestion._id}
              onClick={() => {
                setSearchTerm('');
                setSearchSuggestions([]);
              }}
            >
              <div className="px-xs hover:bg-secondary rounded-xs py-[5px] transition-colors duration-150">
                {suggestion.value}
              </div>
            </Link>
          ))}
      </Card>
    </div>
  );
}
