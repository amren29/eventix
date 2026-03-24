import { Skeleton } from "@/components/ui/skeleton";
export default function EventsLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2"><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-48" /></div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-9 w-96" />
      <div className="space-y-3">
        {[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
    </div>
  );
}
