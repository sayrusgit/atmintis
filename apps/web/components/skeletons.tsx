import { Skeleton } from '@/components/ui/skeleton';

export const ListsSkeleton = () => {
  return (
    <div className="mt-lg grid grid-cols-2 grid-rows-2 gap-lg lg:grid-cols-3 xl:grid-cols-4">
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-full w-full rounded-xl" />
      <Skeleton className="h-full w-full rounded-xl" />
      <Skeleton className="h-full w-full rounded-xl" />
      <Skeleton className="h-full w-full rounded-xl" />
      <Skeleton className="h-full w-full rounded-xl" />
      <Skeleton className="h-full w-full rounded-xl" />
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  );
};

export const DefinitionsSkeleton = () => {
  return (
    <div className="space-y-lg">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
};
