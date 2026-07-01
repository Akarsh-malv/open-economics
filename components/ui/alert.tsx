import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/ui";

const alertVariants = cva(
  "relative shadow-xs grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
        success:
          "border-slate-200 bg-slate-50 text-[#0b1f3a] dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100 *:data-[slot=alert-description]:text-slate-700 dark:*:data-[slot=alert-description]:text-slate-300 [&>svg]:text-[#0b1f3a] dark:[&>svg]:text-slate-200",
        warning:
          "border-slate-200 bg-slate-50 text-[#0b1f3a] dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100 *:data-[slot=alert-description]:text-slate-700 dark:*:data-[slot=alert-description]:text-slate-300 [&>svg]:text-[#0b1f3a] dark:[&>svg]:text-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
