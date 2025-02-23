import { manrope } from '@/styles/fonts';
import type { IEntry } from '@shared/types';
import DefinitionSection from '@/components/entry/definitions-section';
import { DefinitionsSkeleton } from '@/components/skeletons';
import React, { Suspense } from 'react';
import TagsSection from '@/components/entry/tags-section';
import Image from 'next/image';
import UpdateEntryImage from '@/components/entry/update-entry-image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { $fetch } from '@/lib/fetch';
import { STATIC_URL } from '@/lib/utils';
import type { Metadata } from 'next';

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
            <Link href={'/list/' + entry.list}>List</Link>
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
            <h1 className={`${manrope.className} text-4xl`}>{entry.value}</h1>
            <p className="italic text-muted-foreground">{entry.type}</p>
          </div>
          <TagsSection entry={entry} />
          <div className="mt-sm flex flex-wrap gap-sm">
            {entry.context?.map((context) => (
              <div className="flex items-center gap-xs" key={context.value + entry._id}>
                <div className={`h-7 w-7 rounded-xs bg-${context.color}`}></div>
                <span className="italic leading-none">{context.value}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="mt-sm text-lg leading-none">{entry.description}</p>
          </div>
        </div>
        {entry.image ? (
          <Image
            src={STATIC_URL + '/images/' + entry.image}
            className="h-28 min-w-28 rounded-xl bg-secondary object-cover"
            style={{ overflowClipMargin: 'unset' }}
            height={112}
            width={112}
            alt="entry image"
          />
        ) : (
          <UpdateEntryImage entryId={entry._id} />
        )}
      </div>
      <hr className="my-lg" />
      <Suspense fallback={<DefinitionsSkeleton />}>
        <DefinitionSection entryId={entry._id} />
      </Suspense>
    </div>
  );
}

export default Page;
