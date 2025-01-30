'use client';

import { IEntry } from '@shared/types';
import React, { useEffect, useState } from 'react';
import UpdateEntryImage from '@/components/entry/update-entry-image';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UpdateEntryDto } from '@/lib/dto';
import { Button } from '@/components/ui/button';
import { updateEntryAction } from '@/lib/actions';
import { $fetch } from '@/lib/fetch';

function Page() {
  const { id } = useParams<{ id: string }>();

  const [entry, setEntry] = useState<IEntry | null>(null);

  const [data, setData] = useState<UpdateEntryDto>({
    value: '',
    description: '',
    type: '',
    list: '',
  });

  useEffect(() => {
    const fetchEntry = async () => {
      const { data, error } = await $fetch<IEntry>('/entries/:id', { params: { id } });

      if (error) return;

      setData({
        value: data.value,
        description: data.description,
        type: data.type || '',
        list: data.list,
      });
      setEntry(entry);
    };

    fetchEntry();
  }, []);

  return (
    <div>
      <h1 className="animate-pulse text-center text-lg font-medium">⚠️ Editing mode ⚠️</h1>
      <div className="mt-sm flex justify-between gap-md">
        <div className="flex flex-col gap-md">
          <div className="flex items-end gap-xs">
            <Input
              value={data.value}
              onChange={(e) => setData({ ...data, value: e.target.value })}
            />
            <Select onValueChange={(value) => setData({ ...data, type: value })} value={data.type}>
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
          <Input
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>
        {entry && <UpdateEntryImage entryId={entry._id} />}
      </div>
      <Button className="mt-lg w-full" onClick={() => updateEntryAction(id, data)}>
        Edit
      </Button>
    </div>
  );
}

export default Page;
