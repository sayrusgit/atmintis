import ListsSectionItem from '@/components/root/lists-section-item';
import { get } from '@/lib/neofetch';
import Link from 'next/link';
import React from 'react';
import { getLocalSession } from '@/lib/session';
import { IList } from '@shared/types';
import ListsSectionItemAdd from '@/components/root/lists-section-item-add';

export default async function ListsSection() {
  const session = await getLocalSession();
  const lists = await get<IList[]>('lists/get-by-user/' + session?.id);

  return (
    <div className="mt-lg grid grid-cols-2 gap-[30px] lg:grid-cols-3 xl:grid-cols-4">
      {lists?.map((list) => (
        <Link href={'list/' + list._id} key={list._id}>
          <ListsSectionItem list={list} />
        </Link>
      ))}
      <ListsSectionItemAdd />
    </div>
  );
}
