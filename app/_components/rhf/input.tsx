"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useId } from "react";
import { FieldMessageError } from "./field-message-error";

interface InputFieldProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  name: Path<T>;
  label?: string;
  labelClassName?: string;
}

export const InputField = <T extends FieldValues>({
  label,
  className,
  labelClassName,
  name,
  readOnly,
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
            {label && (
              <Label className={cn(labelClassName)} htmlFor={internalId}>
                {label}
              </Label>
            )}
            <Input
              data-readonly={readOnly}
              id={internalId}
              name={name}
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
                  "data-[readonly=true]:focus-visible:border-input cursor-default data-[readonly=true]:focus-visible:ring-0",
                className,
              )}
              readOnly={readOnly}
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
              <FieldMessageError invalid={invalid} message={error?.message} />
            </div>
          </div>
        );
      }}
    />
  );
};
