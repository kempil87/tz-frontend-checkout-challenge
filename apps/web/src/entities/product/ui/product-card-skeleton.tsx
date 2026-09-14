import { Skeleton } from '@/shared/ui';

export const ProductCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl bg-layout p-4">
      <Skeleton className="h-32 rounded-2xl" />

      <Skeleton className="h-6 w-3/4" />

      <Skeleton className="h-4 w-1/3" />

      <Skeleton className="h-4 w-full" />

      <Skeleton className="mt-auto h-10 w-full" />
    </div>
  );
};
