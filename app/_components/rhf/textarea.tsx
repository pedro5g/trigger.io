"use client";

import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { LordIcon } from "../animate-icons/lord-icon";
import { LORDICON_LIBRARY, LORDICON_THEMES } from "@/constants";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useId } from "react";
import { Textarea } from "../ui/textarea";

interface TextareaFieldProps<T extends FieldValues>
  extends React.ComponentProps<"textarea"> {
  name: Path<T>;
  label?: string;
}

export const TextareaField = <T extends FieldValues>({
  label,
  className,
  name,
  ...props
}: TextareaFieldProps<T>) => {
  const id = useId();
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { name, onBlur, onChange, ref, value },
        fieldState: { invalid, error },
      }) => {
        return (
          <div className="*:not-first:mt-3">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Textarea
              id={id}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
              value={value}
              className={cn("peer", className)}
              aria-invalid={invalid}
              {...props}
            />
            <div
              id={id}
              role="alert"
              aria-live="polite"
              aria-atomic="true"
              className="peer-aria-invalid:text-destructive mt-2"
            >
              {invalid && error?.message && (
                <p className="inline-flex items-center gap-2 text-xs tracking-tight">
                  <LordIcon
                    src={LORDICON_LIBRARY.error55}
                    size={20}
                    colors={LORDICON_THEMES.error}
                    speed={0.5}
                    trigger="mount"
                  />
                  {error?.message}
                </p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};
