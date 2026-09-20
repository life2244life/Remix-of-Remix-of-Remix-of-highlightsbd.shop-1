import { Skeleton } from "@/components/ui/skeleton";

const TestimonialsSkeleton = () => (
  <div className="space-y-12">
    <div className="space-y-3 text-center">
      <Skeleton className="mx-auto h-9 w-72" />
      <Skeleton className="mx-auto h-5 w-56" />
    </div>
    <Skeleton className="h-48 w-full rounded-3xl" />
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-72 rounded-3xl" />
      ))}
    </div>
    <Skeleton className="h-28 w-full rounded-3xl" />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-2xl" />
      ))}
    </div>
  </div>
);

export default TestimonialsSkeleton;