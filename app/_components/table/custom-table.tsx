import * as ShadCnTable from "@/app/_components/ui/table";
import { cn } from "@/lib/utils";

export const Table = ({
  className,
  ...props
}: React.ComponentProps<typeof ShadCnTable.Table>) => {
  return (
    <ShadCnTable.Table
      className={cn(
        "m-0 w-max min-w-full border-separate border-spacing-0 border-none p-0 text-left md:w-full [&_tbody_tr_td]:border-b",
        className,
      )}
      {...props}
    />
  );
};

export const THead = ({
  className,
  ...props
}: React.ComponentProps<typeof ShadCnTable.TableHeader>) => {
  return (
    <ShadCnTable.TableHeader
      className={cn("h-8 border bg-zinc-800/40 shadow-2xl", className)}
      {...props}
    />
  );
};

export const Tr = ({
  className,
  ...props
}: React.ComponentProps<typeof ShadCnTable.TableRow>) => {
  return (
    <ShadCnTable.TableRow
      className={cn("hover:bg-transparent", className)}
      {...props}
    />
  );
};

export const Th = ({
  className,
  ...props
}: React.ComponentProps<typeof ShadCnTable.TableHead>) => {
  return (
    <ShadCnTable.TableHead
      className={cn(
        "h-8 w-fit border-t border-b border-gray-300/20 px-3 text-xs font-semibold text-gray-100 first:rounded-l-md first:border-l last:rounded-r-md last:border-r",
        className,
      )}
      {...props}
    />
  );
};

export const TBody = ({
  className,
  ...props
}: React.ComponentProps<typeof ShadCnTable.TableBody>) => {
  return <ShadCnTable.TableBody className={cn(className)} {...props} />;
};

export const Td = ({
  className,
  ...props
}: React.ComponentProps<typeof ShadCnTable.TableCell>) => {
  return (
    <ShadCnTable.TableCell
      className={cn(
        "h-10 overflow-hidden border-zinc-700/60 px-3 py-3 text-sm text-ellipsis whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
};

export const TFooter = ({
  className,
  ...props
}: React.ComponentProps<typeof ShadCnTable.TableFooter>) => {
  return (
    <ShadCnTable.TableFooter
      className={cn("bg-transparent", className)}
      {...props}
    />
  );
};
