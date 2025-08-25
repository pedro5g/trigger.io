"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LORDICON_THEMES } from "@/constants";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useId } from "react";
import { AnimateIcon } from "../animate-icons/aniamtion-icon";

interface InputFieldProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  name: Path<T>;
  label?: string;
}

export const InputField = <T extends FieldValues>({
  label,
  className,
  name,
  id,
  ...props
}: InputFieldProps<T>) => {
  const internalId = id ? id : useId();
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
            {label && <Label htmlFor={internalId}>{label}</Label>}
            <Input
              id={internalId}
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
              id={internalId}
              role="alert"
              aria-live="polite"
              aria-atomic="true"
              className="peer-aria-invalid:text-destructive mt-2"
            >
              {invalid && error?.message && (
                <p className="text-destructive inline-flex items-center gap-2 text-xs tracking-tight">
                  <AnimateIcon
                    src="error"
                    size={20}
                    colors={LORDICON_THEMES.error}
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
