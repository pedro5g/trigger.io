import { cn } from "@/lib/utils";

interface InfoBoxProps {
  children: React.ReactNode;
  className?: string;
}

export const InfoBox = ({ children, className }: InfoBoxProps) => {
  return (
    <div
      className={cn(
        "flex h-80 flex-col items-center justify-center gap-8 rounded-lg border border-gray-300/20 p-6",
        className,
      )}
    >
      <div className="flex max-w-md flex-col gap-2 text-center">{children}</div>
    </div>
  );
};

export const InfoBoxTitle = ({ children, className }: InfoBoxProps) => {
  return (
    <h1
      className={cn(
        "text-xl font-bold tracking-[-0.16px] text-gray-100",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export const InfoBoxAuxiliaryText = ({ children, className }: InfoBoxProps) => {
  return (
    <span
      className={cn(
        "text-sm font-normal text-balance text-gray-300",
        className,
      )}
    >
      {children}
    </span>
  );
};
