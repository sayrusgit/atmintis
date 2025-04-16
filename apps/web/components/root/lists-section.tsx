import ListsSectionItem from '@/components/root/lists-section-item';
import Link from 'next/link';
import React from 'react';
import { getLocalSession } from '@/lib/session';
import type { IList } from '@shared/types';
import ListsSectionItemAdd from '@/components/root/lists-section-item-add';
import { $fetch } from '@/lib/fetch';

export default async function ListsSection() {
  const session = await getLocalSession();
  const { data: lists } = await $fetch<IList[]>('/lists/get-by-user/' + session?.id, {
    cache: 'force-cache',
  });

  return (
    <div className="grid grid-cols-1 gap-md py-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {lists?.map((list) => (
        <Link href={'/collection/' + list._id} key={list._id}>
          <ListsSectionItem list={list} />
        </Link>
      ))}
      <ListsSectionItemAdd />
    </div>
  );
}
