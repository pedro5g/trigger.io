import { Skeleton } from "@/app/_components/ui/skeleton";

export function ProjectsTreeSkeleton() {
  return (
    <div className="flex h-full flex-col gap-2 *:first:grow">
      <ul className="space-y-2">
        <li>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        </li>

        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="mt-2 ml-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>

            <ul className="mt-1 ml-6 space-y-1">
              <li className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-20" />
              </li>
              <li className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-20" />
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
