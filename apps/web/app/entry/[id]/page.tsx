import { manrope } from '@/styles/fonts';
import { get } from '@/lib/neofetch';
import { IEntry } from '@shared/types';
import DefinitionSection from '@/components/entry/definitions-section';
import { DefinitionsSkeleton } from '@/components/skeletons';
import React, { Suspense } from 'react';
import TagsSection from '@/components/entry/tags-section';
import Image from 'next/image';
import UpdateEntryImage from '@/components/entry/update-entry-image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

type IProps = { params: Promise<{ id: string }> };

async function Page({ params }: IProps) {
  const { id } = await params;

  const entry = await get<IEntry>('entries/' + id);

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
          <div className="flex items-end gap-xs">
            <h1 className={`${manrope.className} text-4xl`}>{entry.value}</h1>
            <p className="italic text-muted-foreground">{entry.type}</p>
          </div>
          <TagsSection entry={entry} />
          <div className="">
            {entry.context?.map((context) => (
              <div className="mt-sm flex items-center gap-xs" key={context.value + entry._id}>
                <div className={`h-7 w-7 rounded-xs bg-[${context.color}]`}></div>
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
            src={'http://localhost:5000/static/images/' + entry.image}
            className="h-28 min-w-28 rounded-xl bg-accent object-cover"
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
