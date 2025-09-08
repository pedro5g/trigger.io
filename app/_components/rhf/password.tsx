"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LORDICON_THEMES } from "@/constants";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useCallback, useId, useState } from "react";
import { AnimateIcon } from "../animate-icons/animation-icon";
import { FieldMessageError } from "./field-message-error";
import { VisibleIndicator } from "./visible-indicator";

interface InputPasswordProps<T extends FieldValues>
  extends Omit<React.ComponentProps<"input">, "type" | "placeholder"> {
  name: Path<T>;
  label?: string;
}

export const InputPassword = <T extends FieldValues>({
  label,
  className,
  name,
  ...props
}: InputPasswordProps<T>) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const id = useId();
  const { control } = useFormContext<T>();

  const toggleVisibility = useCallback(
    () => setIsVisible(!isVisible),
    [isVisible],
  );

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
            {label && <Label htmlFor={id}>{label}</Label>}{" "}
            <div className="relative">
              <Input
                id={id}
                name={name}
                className="pe-9"
                placeholder="••••••••••••"
                type={isVisible ? "text" : "password"}
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                aria-describedby={`${id}-description`}
                aria-invalid={invalid}
                ref={ref}
                {...props}
              />
              <VisibleIndicator
                isVisible={isVisible}
                toggleVisibility={toggleVisibility}
              />
            </div>
            <div
              id={id}
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
