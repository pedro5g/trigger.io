"use client";

import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useId } from "react";
import { Textarea } from "../ui/textarea";
import { FieldMessageError } from "./field-message-error";

interface TextareaFieldProps<T extends FieldValues>
  extends React.ComponentProps<"textarea"> {
  name: Path<T>;
  label?: string;
}

export const TextareaField = <T extends FieldValues>({
  id,
  label,
  className,
  name,
  readOnly,
  ...props
}: TextareaFieldProps<T>) => {
  const compId = id ? id : useId();
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
            {label && <Label htmlFor={compId}>{label}</Label>}
            <Textarea
              id={compId}
              name={name}
              data-readonly={readOnly}
              onBlur={onBlur}
              onChange={(e) => {
                if (readOnly) return;
                onChange(e);
              }}
              ref={ref}
              value={value}
              className={cn(
                "peer",
                readOnly &&
                  "data-[readonly=true]:focus-visible:border-input cursor-default resize-none data-[readonly=true]:focus-visible:ring-0",
                className,
              )}
              aria-invalid={invalid}
              readOnly={readOnly}
              {...props}
            />
            <div
              id={compId}
              role="alert"
              aria-live="polite"
              aria-atomic="true"
              className="peer-aria-invalid:text-destructive mt-2"
            >
              <FieldMessageError invalid={invalid} message={error?.message} />
            </div>
          </div>
        );
      }}
    />
  );
};
