"use client";
import { unstable_ViewTransition as ViewTransition } from "react";
import { useServerAction } from "zsa-react";
import { resetPasswordAction } from "../actions";
import { Frown, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { LORDICON_THEMES } from "@/constants";
import { redirect, RedirectType } from "next/navigation";
import { cn, logger, sleep } from "@/lib/utils";
import { Logo } from "@/app/_components/logo";
import { Form } from "@/app/_components/rhf/form";
import { useForm } from "react-hook-form";
import { InputOTP } from "@/app/_components/rhf/input-otp";
import { resetPasswordSchema, type ResetPasswordSchemaType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { StrongPassword } from "@/app/_components/rhf/strong-password";
import { useState, useEffect } from "react";
import { toast } from "@/app/_components/ui/sonner";
import { AnimateIcon } from "@/app/_components/animate-icons/aniamtion-icon";

interface ResetPasswordFormProps {
  token?: string;
  expires?: string;
  email?: string;
}

export const ResetPasswordForm = ({
  token,
  expires,
  email,
}: ResetPasswordFormProps) => {
  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
    },
  });

  const { execute, isPending } = useServerAction(resetPasswordAction, {
    async onSuccess() {
      toast.success(
        "Password changed successfully 🎉",
        "time to log in and test it out.",
      );
      await sleep();
      redirect(
        email ? `/sign-in?email=${encodeURIComponent(email)}` : "/sign-in",
        RedirectType.replace,
      );
    },
    onError({ err }) {
      if (err.data === "RESOURCE_NOT_FOUND") {
        toast.error(
          "That reset code is invalid or has expired.",
          "Try requesting a new password reset.",
        );
        return;
      }
      toast.error("Oops, that’s on us. coffee break ☕", "try again in a bit.");
      logger.error("sign in error", err);
    },
  });

  const onSubmit = async ({ token, password }: ResetPasswordSchemaType) => {
    if (isPending) return;
    await execute({ token, password });
  };

  const now = Date.now();
  const expirationTime = expires ? Number(expires) : 0;
  const isValid = expirationTime > now;

  return isValid ? (
    <div className="h-full w-full rounded-md p-5">
      <div className="mb-4 flex items-center justify-center">
        <Logo className="w-fit" href="/sign-in" />
      </div>
      <div className="rounded-md bg-blue-950/10 px-1 py-2 ring-3 ring-blue-950/40 md:px-4">
        <h1 className="mt-8 mb-1.5 text-center text-xl font-bold tracking-[-0.16px] dark:text-[#fcfdffef]">
          Set up a new password
        </h1>
        <p className="mb-6 text-center text-[15px] font-normal dark:text-[#f1f7feb5]">
          Your password must be different from your previous one.
        </p>

        <ExpirationTimer expiresAt={expirationTime} />

        <Form {...methods}>
          <form
            className="flex flex-col gap-6"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="w-full space-y-4">
              <div className="flex items-center justify-center">
                <InputOTP
                  label="Reset code"
                  classNameLabel="inline-flex items-center justify-center text-2xl"
                  name="token"
                  maxLength={8}
                />
              </div>
              <StrongPassword label="Enter with new password" name="password" />
            </div>
            <ViewTransition name="auth-button-transition">
              <Button
                disabled={isPending}
                className="h-[40px] w-full text-[15px] font-semibold text-white"
              >
                {isPending && <Loader2 className="animate-spin" />}
                Update password
              </Button>
            </ViewTransition>
          </form>
        </Form>
      </div>
    </div>
  ) : (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md">
      <div>
        <Frown size="48px" className="animate-bounce text-red-500" />
      </div>
      <h2 className="text-xl font-bold tracking-[-0.16px] dark:text-[#fcfdffef]">
        Invalid or expired reset link
      </h2>
      <p className="text-muted-foreground mb-2 text-center text-sm font-normal dark:text-[#f1f7feb5]">
        You can request a new password reset link
      </p>
      <ViewTransition name="auth-button-transition">
        <Link
          className={cn(
            buttonVariants({
              variant: "default",
            }),
            "h-[40px] text-white",
          )}
          href="/forgot-password?email="
        >
          Go to forgot password
          <AnimateIcon
            src="arrow"
            size={20}
            colors={LORDICON_THEMES.dark}
            speed={0.5}
            trigger="mount"
          />
        </Link>
      </ViewTransition>
    </div>
  );
};

const ExpirationTimer = ({ expiresAt }: { expiresAt: number }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);

      if (remaining === 0 && !isExpired) {
        setIsExpired(true);
      }

      setTimeLeft(remaining);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, isExpired]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimerStyles = () => {
    const totalMinutes = 10 * 60 * 1000;
    const percentage = (timeLeft / totalMinutes) * 100;

    if (percentage > 50) {
      return "from-green-500/10 via-green-600/5 to-gray-900/95 border-green-500/20 text-green-50";
    } else if (percentage > 25) {
      return "from-amber-500/10 via-orange-600/5 to-gray-900/95 border-amber-500/20 text-amber-50";
    } else {
      return "from-red-500/10 via-red-600/5 to-gray-900/95 border-red-500/20 text-red-50";
    }
  };

  const getIconColor = () => {
    const totalMinutes = 10 * 60 * 1000;
    const percentage = (timeLeft / totalMinutes) * 100;

    if (percentage > 50) return LORDICON_THEMES.success;
    if (percentage > 25) return LORDICON_THEMES.warning;
    return LORDICON_THEMES.error;
  };

  if (isExpired) {
    return (
      <div className="mb-6 animate-pulse rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-red-600/5 to-gray-900/95 p-4 text-red-50 backdrop-blur-md">
        <div className="flex items-center justify-center gap-2">
          <AnimateIcon
            src="warning"
            size={20}
            colors={LORDICON_THEMES.error}
            speed={0.5}
            trigger="mount"
          />
          <span className="text-sm font-semibold">Link Expired</span>
        </div>
        <div className="mt-1 text-center text-xs text-red-200/80">
          This reset link has expired. Please request a new one.
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-6 rounded-xl border bg-gradient-to-br p-4 backdrop-blur-md transition-all duration-500",
        getTimerStyles(),
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <AnimateIcon
          src="clock"
          size={20}
          colors={getIconColor()}
          speed={0.5}
          trigger="mount"
          className="animate-pulse"
        />
        <span className="text-sm font-semibold">Link expires in</span>
      </div>
      <div className="mt-2 text-center font-mono text-2xl font-bold tracking-wider">
        {formatTime(timeLeft)}
      </div>
      <div className="mt-1 text-center text-xs opacity-80">
        Complete the reset before time runs out
      </div>
    </div>
  );
};
