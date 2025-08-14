"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LordIcon } from "../animate-icons/lord-icon";
import { LORDICON_LIBRARY, LORDICON_THEMES } from "@/constants";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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

  const toggleVisibility = () => setIsVisible(!isVisible);

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
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>
            </div>
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
