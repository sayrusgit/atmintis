import React, { Suspense } from 'react';
import ListsSection from '@/components/root/lists-section';
import { ListsSkeleton } from '@/components/skeletons';

export default async function Home() {
  return (
    <>
      {/*<SpaceSection />*/}
      <div className="mt-lg flex items-center justify-between">
        <h1 className="text-4xl leading-none">Collections</h1>
        <div className="rounded-md border bg-card px-sm py-1">Main Space</div>
      </div>
      <Suspense fallback={<ListsSkeleton />}>
        <ListsSection />
      </Suspense>
    </>
  );
}
