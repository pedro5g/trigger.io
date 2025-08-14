"use client";

import { useId } from "react";
import { OTPInput, SlotProps } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/app/_components/ui/label";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface InputOTPProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  className?: string;
  classNameLabel?: string;
  maxLength?: number;
}

export function InputOTP<T extends FieldValues>({
  name,
  label,
  className,
  classNameLabel,
  maxLength = 6,
}: InputOTPProps<T>) {
  const id = useId();
  const { control } = useFormContext<T>();

  const isEven = Math.ceil(maxLength) % 2 === 0;

  return (
    <div className="*:not-first:mt-2">
      {label && (
        <Label className={cn("w-full", classNameLabel)} htmlFor={id}>
          {label}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, ref, name, value } }) => (
          <OTPInput
            id={id}
            ref={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            containerClassName={cn(
              "flex items-center gap-3 has-disabled:opacity-50",
              className,
            )}
            maxLength={Math.ceil(maxLength)}
            render={({ slots }) => {
              if (isEven) {
                const half = Math.ceil(maxLength / 2);

                return (
                  <>
                    <div className="flex">
                      {slots.slice(0, half).map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>

                    <div className="text-muted-foreground/80">
                      <MinusIcon size={16} aria-hidden="true" />
                    </div>

                    <div className="flex">
                      {slots.slice(half).map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  </>
                );
              } else {
                return (
                  <div className="flex">
                    {slots.map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                );
              }
            }}
          />
        )}
      />
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input text-foreground relative -ms-px flex size-9 items-center justify-center border bg-transparent font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-md last:rounded-e-md",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
