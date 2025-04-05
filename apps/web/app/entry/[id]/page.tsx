'use server';

import { manrope } from '@/styles/fonts';
import type { IEntry } from '@shared/types';
import DefinitionSection from '@/components/entry/definitions-section';
import { DefinitionsSkeleton } from '@/components/skeletons';
import React, { Suspense } from 'react';
import TagsSection from '@/components/entry/tags-section';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { $fetch } from '@/lib/fetch';
import type { Metadata } from 'next';
import EntryImageSection from '@/components/entry/entry-image-section';
import EntryValue from '@/components/entry/entry-value';
import EntryDescription from '@/components/entry/entry-description';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data } = await $fetch<IEntry>('/entries/' + id, {
    cache: 'force-cache',
    next: { tags: ['entry'] },
  });

  return {
    title: `${data?.value} | atmintis`,
  };
}

async function Page({ params }: Props) {
  const { id } = await params;

  const { data: entry, error } = await $fetch<IEntry>('/entries/' + id, {
    cache: 'force-cache',
    next: { tags: ['entry'] },
  });

  if (error) return <p>Entry not found</p>;

  return (
    <div>
      <Breadcrumb className="mb-xs">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href={'/collection/' + entry.list}>Collection</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{entry.value}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between">
        <div>
          <div className="flex items-end gap-sm">
            <EntryValue initialValue={entry.value} entryId={entry._id} />
            <p className="italic text-muted-foreground">{entry.type}</p>
          </div>
          <TagsSection entry={entry} />
          {entry?.extras ? (
            <div className="mt-sm flex flex-wrap gap-sm">
              {entry.extras?.map((extra) => (
                <div className="flex items-center gap-xs" key={extra.value + entry._id}>
                  <div className={`h-7 w-7 rounded-xs bg-${extra.color}`}></div>
                  <span className="italic leading-none">{extra.value}</span>
                </div>
              ))}
            </div>
          ) : null}
          <EntryDescription entryId={entry._id} initialValue={entry.description} />
        </div>
        <EntryImageSection entry={entry} />
      </div>
      <hr className="my-lg" />
      <Suspense fallback={<DefinitionsSkeleton />}>
        <DefinitionSection entryId={entry._id} />
      </Suspense>
    </div>
  );
}

export default Page;
