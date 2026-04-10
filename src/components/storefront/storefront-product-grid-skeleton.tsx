import { PAGE_SIZE } from "@/components/storefront/storefront-page-config";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden rounded-[28px] border-[color:var(--border)] bg-[color:var(--surface-strong)]"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Separator />
            <div className="flex items-center justify-between">
              <Skeleton className="h-14 w-28" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
