"use client";

import { useId, useMemo, useState, type ComponentProps } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { LORDICON_THEMES } from "@/constants";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { AnimateIcon } from "../animate-icons/aniamtion-icon";

interface StrongPasswordProps<T extends FieldValues>
  extends Omit<ComponentProps<"input">, "type" | "placeholder" | "id"> {
  name: Path<T>;
  label?: string;
}

export function StrongPassword<T extends FieldValues>({
  label,
  name,
  ...props
}: StrongPasswordProps<T>) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const id = useId();

  const { control, watch } = useFormContext<T>();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "At least 1 symbol" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(watch(name));

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score <= 4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 4) return "Medium password";
    return "Strong password";
  };

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({
          field: { name, onBlur, onChange, ref, value },
          fieldState: { invalid },
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
                    <AnimateIcon
                      src="eye"
                      size={16}
                      colors={LORDICON_THEMES.dark}
                      state="hover-eye-lashes"
                      trigger="mount"
                      aria-hidden="true"
                    />
                  ) : (
                    <AnimateIcon
                      src="eye"
                      size={16}
                      colors={LORDICON_THEMES.dark}
                      trigger="mount"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>
          );
        }}
      />

      <div
        className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 5) * 100}%` }}
        ></div>
      </div>

      <p
        id={`${id}-description`}
        className="text-foreground mb-2 text-sm font-medium"
      >
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <AnimateIcon
                src="success"
                size={16}
                colors={LORDICON_THEMES.success}
                speed={0.9}
                trigger="mount"
              />
            ) : (
              <AnimateIcon
                src="close"
                size={16}
                colors={LORDICON_THEMES.error}
                speed={0.9}
                delay={180}
                trigger="mount"
              />
            )}
            <span
              className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
