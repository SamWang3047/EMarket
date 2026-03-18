import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-[linear-gradient(90deg,rgba(219,208,192,0.55),rgba(255,255,255,0.8),rgba(219,208,192,0.55))] bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}
