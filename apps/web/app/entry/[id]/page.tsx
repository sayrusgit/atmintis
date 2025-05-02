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
import { Separator } from '@/components/ui/separator';
import EntryKeyboardNav from '@/components/entry/entry-keyboard-nav';

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
      <div className="gap-md flex justify-between">
        <div>
          <div className="gap-xs flex items-end">
            <EntryValue initialValue={entry.value} entryId={entry._id} />
            <p className="text-muted-foreground italic">{entry.type}</p>
          </div>
          <TagsSection entry={entry} />
          {entry?.extras ? (
            <div className="mt-sm gap-sm flex flex-wrap">
              {entry.extras?.map((extra) => (
                <div className="gap-xs flex items-center" key={extra.value + entry._id}>
                  <div className={`h-7 w-7 rounded-xs bg-${extra.color}`}></div>
                  <span className="leading-none italic">{extra.value}</span>
                </div>
              ))}
            </div>
          ) : null}
          <EntryDescription entryId={entry._id} initialValue={entry.description} />
        </div>
        <EntryImageSection entry={entry} />
      </div>
      <Separator className="my-lg" />
      <Suspense fallback={<DefinitionsSkeleton />}>
        <DefinitionSection entryId={entry._id} />
      </Suspense>
      <EntryKeyboardNav />
    </div>
  );
}

export default Page;
