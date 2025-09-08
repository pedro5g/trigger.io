import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md 
   text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 
   [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 
   outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
   aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive 
   data-[loading=true]:[&>[data-comp='button-label']]:invisible data-[loading=true]:[&>[data-comp='button-kbd']]:invisible
   data-[loading=false]:[&>[data-comp='button-loader']]:invisible *:not-first:[&>[data-comp='button-kbd']]:ml-1
   `,
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 
        data-[variant='default']:[&>[data-comp='button-kbd']>kbd]:text-white data-[variant='default']:[&>[data-comp='button-kbd']>kbd]:bg-blue-400/60
        data-[variant='default']:[&>[data-comp='button-loader']>span_span]:bg-blue-200
        `,
        destructive: `bg-red-500 text-red-100 shadow-xs disabled:cursor-not-allowed hover:bg-red-500/90 dark:hover:bg-red-500/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-red-500
        data-[variant='destructive']:[&>div[data-comp='button-kbd']>kbd]:text-red-100 data-[variant='destructive']:[&>div[data-comp='button-kbd']>kbd]:bg-red-400
        data-[variant='destructive']:[&>[data-comp='button-loader']>span_span]:bg-red-200 
        `,
        outline: `border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 
           data-[variant='outline']:[&>[data-comp='button-kbd']>kbd]:text-white data-[variant='outline']:[&>[data-comp='button-kbd']>kbd]:bg-zinc-400/30
           has-[div[data-comp='button-kbd']]:border-none
           `,
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-variant={variant || "default"}
      data-slot="button"
      data-loading={loading}
      className={cn(buttonVariants({ variant, size, className }), "")}
      {...props}
    />
  );
}

function ButtonLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-comp="button-label"
      {...props}
      className={cn(
        "inline-flex min-w-0 items-center justify-center gap-1 truncate font-medium text-white",
        className,
      )}
    />
  );
}

function ButtonKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <div data-comp="button-kbd" className="flex items-center">
      <kbd
        {...props}
        className={cn(
          "inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-base font-black select-none",
          className,
        )}
      />
    </div>
  );
}

function ButtonLoader() {
  return (
    <span
      data-comp="button-loader"
      className="absolute inset-0 flex w-full items-center justify-center"
    >
      <span className="inline-flex items-center gap-1">
        <span className="animate-plop h-1 w-1 rounded-full"></span>
        <span className="animate-plop2 h-1 w-1 rounded-full"></span>
        <span className="animate-plop3 h-1 w-1 rounded-full"></span>
      </span>
    </span>
  );
}

export { Button, ButtonLabel, ButtonKbd, ButtonLoader, buttonVariants };
