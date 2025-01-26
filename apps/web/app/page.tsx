import React, { Suspense } from 'react';
import ListsSection from '@/components/root/lists-section';
import { ListsSkeleton } from '@/components/skeletons';

export default async function Home() {
  return (
    <>
      {/*<SpaceSection />*/}
      <h1 className="mt-lg text-4xl leading-none">Your lists</h1>
      <Suspense fallback={<ListsSkeleton />}>
        <ListsSection />
      </Suspense>
    </>
  );
}
