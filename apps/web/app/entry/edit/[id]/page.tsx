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
import { manrope } from '@/styles/fonts';
import TagsSection from '@/components/entry/tags-section';
import { useFetch } from '@/lib/hooks';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { InputUnderlined } from '@/components/ui/input-underlined';

function Page() {
  const { id } = useParams<{ id: string }>();

  const [entryN, error] = useFetch<IEntry>('/entries/' + id);

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
      <div>
        <div>
          <div className="flex items-end gap-xs">
            <h1 className={`${manrope.className} animate-pulse text-4xl`}>{entryN?.value}</h1>
            <p className="italic text-muted-foreground">{entryN?.type}</p>
          </div>
          {/*<TagsSection entry={entry} />*/}
          <div className="">
            {entryN?.context?.map((context) => (
              <div className="mt-sm flex items-center gap-xs" key={context.value + entryN._id}>
                <div className={`h-7 w-7 rounded-xs bg-[${context.color}]`}></div>
                <span className="italic leading-none">{context.value}</span>
              </div>
            ))}
          </div>
          <InputUnderlined value={entryN?.description} onChange={() => false} />
        </div>
        <div className="mt-sm flex justify-between gap-md">
          <div className="flex flex-col gap-md">
            <div className="flex items-end gap-xs">
              <Input
                value={data.value}
                onChange={(e) => setData({ ...data, value: e.target.value })}
              />
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
      <Card className="flex items-start justify-between gap-md p-4">
        <div className="flex flex-col gap-xs">
          123
          <ol>
            <li>• 123</li>
          </ol>
        </div>
        <div className="flex w-[30%] flex-col gap-1 rounded-md bg-secondary p-xs">
          <p className="text-sm">compare</p>
          <Link href={'/entry/sdf'} className="text-blue-500">
            bruh
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Page;
