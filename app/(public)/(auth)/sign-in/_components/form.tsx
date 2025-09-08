"use client";

import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import { useServerAction } from "zsa-react";
import { signInAction } from "../action";
import { Loader2 } from "lucide-react";
import { LORDICON_THEMES } from "@/constants";
import { useRouter } from "next/navigation";
import { useForm, useFormState } from "react-hook-form";
import { signInSchema, type SignInSchemaType } from "../schema";
import { Form } from "@/app/_components/rhf/form";
import { InputField } from "@/app/_components/rhf/input";
import { toast } from "@/app/_components/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputPassword } from "@/app/_components/rhf/password";
import { logger, sleep } from "@/lib/utils";
import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";

interface SignInFormProps {
  email?: string;
}

export const SignInForm = ({ email }: SignInFormProps) => {
  const route = useRouter();
  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const { errors } = useFormState({ control: methods.control });

  const { execute, isPending, isSuccess } = useServerAction(signInAction, {
    async onSuccess() {
      methods.reset();
      toast.success("Login successfully");
      await sleep();

      // [IMPORTANT]: why refresh and non push ?
      // login is made by server action this no cause full page reload, than getUser not gonna reexecute
      // but, why don't use revalidateTag('user') within server action ?
      // that's simple, if i use revalidateTag on server action the session cookie is not yet available the api response is will 401
      // next cookies uses Set-Cookie headers to save cookies and that only ocorres when response arrive browser,
      // before this the cookies only exists on current request context -> -> ->
      //
      route.refresh();
    },
    onError({ err }) {
      if (err.data === "VERIFICATION_ERROR") {
        toast.error(
          "Your email hasn’t been verified yet.",
          "Check your inbox and confirm it before signing in!",
        );
        return;
      }
      if (err.data === "AUTH_INVALID_CREDENTIALS") {
        methods.setError("email", { type: "AUTH_INVALID_CREDENTIALS" });
        methods.setError("password", { type: "AUTH_INVALID_CREDENTIALS" });
        return;
      }

      toast.error("Oops, that’s on us. coffee break ☕", "try again in a bit.");
      logger.error("sign in error", err);
    },
  });

  const onSubmit = ({ email, password }: SignInSchemaType) => {
    if (isPending) return;
    execute({
      email,
      password,
    });
  };

  const emailOnForm = methods.watch("email");

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
                  Sign in to your account
                </h1>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <ViewTransition name="auth-transition">
                    <Link
                      href="/sign-up"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </ViewTransition>
                </div>
              </div>
              <InputField<SignInSchemaType>
                name="email"
                label="Email"
                type="email"
                placeholder="m@example.com"
              />

              <div className="grid gap-1">
                <InputPassword<SignInSchemaType>
                  name="password"
                  label="Password"
                />

                <div className="flex items-center">
                  <ViewTransition name="back-button-transition">
                    <Link
                      href={
                        emailOnForm
                          ? `/forgot-password?email=${encodeURIComponent(emailOnForm)}`
                          : "/forgot-password"
                      }
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </ViewTransition>
                </div>
              </div>

              {[errors.email?.type, errors.password?.type].includes(
                "AUTH_INVALID_CREDENTIALS",
              ) && (
                <div className="rounded-md border bg-red-400/20 px-4 py-3 text-red-500 ring-2 ring-red-500">
                  <p className="flex items-center text-sm leading-0">
                    <AnimateIcon
                      src="warning"
                      size={20}
                      colors={LORDICON_THEMES.error}
                      speed={0.5}
                      trigger="mount"
                      className="me-1 inline-flex"
                    />
                    Invalid email or password.
                  </p>
                  <span className="ml-3 text-xs text-red-200">
                    Double-check your credentials and try again.
                  </span>
                </div>
              )}

              <ViewTransition name="auth-button-transition">
                <Button type="submit" className="w-full text-white">
                  Login
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
