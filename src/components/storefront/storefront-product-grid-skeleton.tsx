import { PAGE_SIZE } from "@/components/storefront/storefront-page-config";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[4/5] rounded-[18px]" />
          <div className="mt-4 flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
