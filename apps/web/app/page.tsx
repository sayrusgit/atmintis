import React, { Suspense } from 'react';
import ListsSection from '@/components/root/lists-section';
import { ListsSkeleton } from '@/components/skeletons';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('root');

  return (
    <>
      <div className="mt-lg flex items-center justify-between">
        <h1 className="text-4xl leading-none">{t('collections')}</h1>
        <div className="rounded-md border bg-card px-sm py-1">{t('mainSpace')}</div>
      </div>
      <Suspense fallback={<ListsSkeleton />}>
        <ListsSection />
      </Suspense>
    </>
  );
}
