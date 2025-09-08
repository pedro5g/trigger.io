import { Skeleton } from "@/app/_components/ui/skeleton";
import {
  Table,
  TBody,
  Td,
  TFooter,
  Th,
  THead,
  Tr,
} from "@/app/_components/table/custom-table";

export const ProjectsTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="inline-flex w-full items-center justify-between">
        <div className="relative w-full max-w-xl">
          <Skeleton className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded" />
          <Skeleton className="h-8 w-full rounded-xl pl-10" />
        </div>
      </div>

      <Table>
        <THead>
          <Tr className="hover:bg-transparent">
            <Th>Project</Th>
            <Th>Domain</Th>
            <Th>Status</Th>
            <Th>Created</Th>
          </Tr>
        </THead>

        <TBody>
          {[...Array(5)].map((_, i) => (
            <Tr key={i}>
              <Td>
                <div className="flex items-center gap-3">
                  <Skeleton className="hidden size-8 rounded-lg lg:flex" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="hidden h-3 w-48 rounded lg:block" />
                  </div>
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>

        <TFooter>
          <Tr>
            <Td colSpan={4}>
              <div className="inline-flex items-center justify-between">
                <Skeleton className="h-3 w-40 rounded" />
              </div>
            </Td>
          </Tr>
        </TFooter>
      </Table>
    </div>
  );
};
