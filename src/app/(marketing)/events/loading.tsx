import { Skeleton } from "@/components/ui/skeleton";
export default function EventsDiscoveryLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="gradient-dark py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Skeleton className="h-10 w-96 mx-auto bg-white/10" />
          <Skeleton className="h-12 w-full bg-white/10" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );
}
