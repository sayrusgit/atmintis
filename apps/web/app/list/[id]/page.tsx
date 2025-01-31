import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { IEntry, IList } from '@shared/types';
import ListEntryItem from '@/components/list/list-entry-item';
import ListControls from '@/components/list/list-controls';
import { getLocalSession } from '@/lib/session';
import { $fetch } from '@/lib/fetch';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data } = await $fetch<IList>('/lists/:id', { params: { id } });

  return {
    title: `${data?.title} | atmintis`,
  };
}

async function Page({ params }: Props) {
  const { id } = await params;

  const { data: entries } = await $fetch<IEntry[]>('/entries/get-by-list/' + id, {
    cache: 'force-cache',
    next: { tags: ['list-entries'] },
  });
  const { data: list } = await $fetch<IList>('/lists/:id', { params: { id } });

  const user = await getLocalSession();

  const isOwner = user?.id === list?.user;

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-4xl leading-none">{list?.title}</h1>
        {isOwner && list && <ListControls list={list} entriesNumber={entries?.length} />}
      </div>
      <Card className="mt-sm min-h-[80vh] break-normal rounded-xl">
        <CardContent className="flex flex-col divide-y p-xs">
          {entries?.length ? (
            entries.map((entry) => (
              <ListEntryItem entry={entry} isOwner={isOwner} key={entry._id} />
            ))
          ) : (
            <p className="mt-lg text-center">Nothing here yet</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default Page;
