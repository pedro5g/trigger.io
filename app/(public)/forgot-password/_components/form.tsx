"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import { useServerAction } from "zsa-react";
import { forgotPasswordAction } from "../actions";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Loader2, MailCheckIcon } from "lucide-react";
import Link from "next/link";
import { LordIcon } from "@/app/_components/animate-icons/lord-icon";
import { LORDICON_LIBRARY, LORDICON_THEMES } from "@/constants";
import { cn, logger } from "@/lib/utils";
import { Logo } from "@/app/_components/logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordSchemaType } from "../schema";
import { Form } from "@/app/_components/rhf/form";
import { InputField } from "@/app/_components/rhf/input";
import { toast } from "@/app/_components/ui/sonner";

interface ForgotPasswordFormProps {
  email?: string;
}

export const ForgotPasswordForm = ({ email }: ForgotPasswordFormProps) => {
  const methods = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: email || "",
    },
  });

  const { execute, isPending, isSuccess } = useServerAction(
    forgotPasswordAction,
    {
      async onSuccess() {
        toast.success(
          "Reset link is on its way 🚀",
          "check your inbox (and maybe your spam folder).",
        );
      },
      onError({ err }) {
        if (err.data === "RESOURCE_NOT_FOUND") {
          methods.setError("email", {
            message:
              "No account matches that email. Maybe try signing up instead?",
          });
          return;
        }
        if (err.data === "AUTH_TOO_MANY_ATTEMPTS") {
          toast.error(
            "Whoa there! Too many reset requests.",
            "Please wait a bit before trying again.",
          );
          return;
        }
        toast.error(
          "Oops, that’s on us. coffee break ☕",
          "try again in a bit.",
        );
        logger.error("sign in error", err);
      },
    },
  );

  const onSubmit = async ({ email }: ForgotPasswordSchemaType) => {
    if (isPending) return;
    execute({ email });
  };

  const emailOnForm = methods.watch("email");

  const expiresAt = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    return now.getTime();
  };
  return !isSuccess ? (
    <div className="h-full w-full rounded-md p-5">
      <div className="flex items-center justify-center">
        <Logo href="/sign-in" className="w-fit" />
      </div>

      <h1 className="mt-8 mb-1.5 text-center text-xl font-bold tracking-[-0.16px] sm:text-left dark:text-[#fcfdffef]">
        Reset password
      </h1>
      <p className="mb-6 text-center text-base font-normal sm:text-left dark:text-[#f1f7feb5]">
        Include the email address associated with your account and we’ll send
        you an email with instructions to reset your password.
      </p>

      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="mb-0">
            <InputField<ForgotPasswordSchemaType>
              name="email"
              placeholder="e@example.com"
              autoComplete="off"
              type="email"
            />
          </div>
          <ViewTransition name="auth-button-transition">
            <Button
              disabled={isPending}
              className="h-[40px] w-full font-semibold text-white"
            >
              {isPending && <Loader2 className="animate-spin" />}
              Send reset instructions
            </Button>
          </ViewTransition>
        </form>
      </Form>
    </div>
  ) : (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md">
      <div>
        <MailCheckIcon size="48px" className="animate-bounce" />
      </div>
      <h2 className="text-xl font-bold tracking-[-0.16px] dark:text-[#fcfdffef]">
        Check your email
      </h2>
      <p className="text-muted-foreground mb-2 text-center text-sm font-normal dark:text-[#f1f7feb5]">
        We just sent a password reset link to {emailOnForm}.
      </p>
      <ViewTransition name="auth-button-transition">
        <Link
          href={`/reset-password?expires=${expiresAt()}`}
          className={cn(
            buttonVariants({
              variant: "default",
            }),
            "h-[40px] text-white",
          )}
        >
          Go to reset form
          <LordIcon
            src={LORDICON_LIBRARY.arrow}
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
