'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input-icons';
import { get } from '@/lib/neofetch';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { IEntry } from '@shared/types';
import { useDebouncedCallback } from '@/lib/hooks';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function PageHeaderInput({ userId }: { userId: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<IEntry[]>([]);

  const performSearch = useDebouncedCallback(async (searchTerm: string) => {
    const res = await get<IEntry[]>(`entries/search-query/${searchTerm}?userId=${userId}`);

    setSearchSuggestions(res);
  }, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value);
    performSearch(event.currentTarget.value);
  };

  return (
    /*TODO rewrite ml-5 to proper grid implementation*/
    <div className="w-full max-w-[605px] md:ml-6">
      <Input
        placeholder="Search"
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
        hidden={!searchSuggestions.length}
        className="absolute top-[70px] w-full max-w-[605px] rounded-md border bg-background p-xs"
      >
        {searchSuggestions.length &&
          searchSuggestions.map((suggestion) => (
            <Link
              href={`/entry/${suggestion._id}`}
              key={suggestion._id}
              onClick={() => {
                setSearchTerm('');
                setSearchSuggestions([]);
              }}
            >
              <div className="rounded-xs px-xs py-[5px] transition-colors duration-150 hover:bg-secondary">
                {suggestion.value}
              </div>
            </Link>
          ))}
      </Card>
    </div>
  );
}
