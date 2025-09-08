"use client";

import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import { useServerAction } from "zsa-react";
import { signUpAction } from "../actions";
import { Loader2 } from "lucide-react";
import { LORDICON_THEMES } from "@/constants";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpSchemaType } from "../schema";
import { Form } from "@/app/_components/rhf/form";
import { InputField } from "@/app/_components/rhf/input";
import { StrongPassword } from "@/app/_components/rhf/strong-password";
import { redirect } from "next/navigation";
import { logger, sleep } from "@/lib/utils";
import { toast } from "@/app/_components/ui/sonner";
import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";

export const SignUpForm = () => {
  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { errors } = useFormState({
    control: methods.control,
  });

  const { execute, isPending, isSuccess } = useServerAction(signUpAction, {
    onSuccess: async () => {
      methods.reset();
      toast.success(
        "Confirmation email sent!",
        "Check your inbox (and maybe your spam folder, just in case).",
      );
      await sleep();
      redirect("/sign-in");
    },
    onError({ err }) {
      if (err.message === "EMAIL_ALREADY_REGISTERED") {
        methods.setError("email", {
          type: "EMAIL_ALREADY_REGISTERED",
        });
        return;
      }
      toast.error("Oops, that’s on us. coffee break ☕", "try again in a bit.");
      logger.error("sign in error", err);
    },
  });

  const onSubmit = ({ name, email, password }: SignUpSchemaType) => {
    if (isPending) return;

    execute({ name, email, password });
  };

  return (
    <div className="flex flex-col gap-6">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 lg:hidden">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex items-center justify-center rounded-md">
                  <Image src="/icon.png" alt="logo" width={65} height={65} />
                </div>
                <span className="sr-only">Trigger.io</span>
              </a>

              <h1 className="text-2xl font-bold">
                Welcome to Trigger<span className="text-blue-400">.io</span>
              </h1>
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-2 text-center">
                <h1 className="hidden text-2xl font-bold lg:block">
                  Create your account
                </h1>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <ViewTransition name="auth-transition">
                    <Link
                      href="/sign-in"
                      className="underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </ViewTransition>
                </div>
              </div>

              <InputField<SignUpSchemaType>
                label="Name"
                type="text"
                name="name"
                placeholder="name example"
              />
              <InputField<SignUpSchemaType>
                label="Email"
                type="email"
                name="email"
                placeholder="m@example.com"
              />

              {errors.email?.type === "EMAIL_ALREADY_REGISTERED" && (
                <div className="rounded-md border bg-red-400/20 px-2 py-1 text-red-500 ring-2 ring-red-500">
                  <p className="flex items-center text-sm leading-0">
                    <AnimateIcon
                      src="warning"
                      size={20}
                      colors={LORDICON_THEMES.error}
                      speed={0.5}
                      trigger="mount"
                      className="me-1 inline-flex"
                    />
                    Looks like this email is already taken.
                  </p>
                  <span className="ml-6 text-xs text-red-200">
                    Try signing in instead!
                  </span>
                </div>
              )}

              <StrongPassword<SignUpSchemaType>
                name="password"
                label="Password"
              />

              <ViewTransition name="auth-button-transition">
                <Button type="submit" className="w-full text-white">
                  Register
                  {isPending && <Loader2 className="animate-spin" />}
                  {isSuccess && (
                    <AnimateIcon
                      src="success"
                      size={20}
                      colors={LORDICON_THEMES.success}
                      speed={0.5}
                      trigger="mount"
                    />
                  )}
                </Button>
              </ViewTransition>
            </div>
          </div>
        </form>
      </Form>

      <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-blue-400">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};
