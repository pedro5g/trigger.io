import { buttonVariants } from "@/app/_components/ui/button";
import { LORDICON_THEMES } from "@/constants";
import { unstable_ViewTransition as ViewTransition } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/app/_components/logo";
import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";

export default function Welcome() {
  return (
    <ViewTransition>
      <main className="flex h-full w-full max-w-2xl flex-col items-center justify-center">
        <div className="mb-10 h-full w-full rounded-md p-5">
          <Logo href="#" className="mx-auto" />
          <h1 className="mt-8 mb-4 text-center text-4xl font-bold tracking-[-0.16px] dark:text-[#fcfdffef]">
            Welcome!
          </h1>
          <p className="mb-6 text-center text-[15px] font-normal sm:text-left dark:text-[#f1f7feb5]">
            Your account has been successfully confirmed. You can now access all
            features of the platform.
          </p>

          <p className="text-muted-foreground mt-6 text-sm font-normal dark:text-[#f1f7feb5]">
            If you experience any issues, feel free to contact{" "}
            <a
              className="focus-visible:ring-primary text-blue-400 transition duration-150 ease-in-out outline-none hover:underline focus-visible:ring-2"
              href="mailto:pedro.env5@gmail.com"
            >
              pedro.env5@gmail.com
            </a>
            .
          </p>
        </div>
        <ViewTransition name="auth-button-transition">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({
                variant: "default",
              }),
              "h-[40px] text-white",
            )}
          >
            Go to login
            <AnimateIcon
              src="exitRoom"
              size={20}
              colors={LORDICON_THEMES.dark}
              speed={0.5}
              trigger="mount"
            />
          </Link>
        </ViewTransition>
      </main>
    </ViewTransition>
  );
}
