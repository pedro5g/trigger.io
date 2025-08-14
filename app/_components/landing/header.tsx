import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";
import { buttonVariants } from "@/app/_components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-gray-800 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <ViewTransition name="logo-image-transition">
            <Image src="/icon.png" alt="logo" width={35} height={35} />
          </ViewTransition>
          <ViewTransition name="logo-name-transition">
            <p className="text-2xl leading-relaxed font-bold text-white">
              Trigger<span className="text-blue-400">.io</span>
            </p>
          </ViewTransition>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "text-gray-300 hover:text-white",
            )}
            href="/sign-in"
          >
            Sign in
          </Link>
          <ViewTransition name="auth-button-transition">
            <Link
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "sm",
                }),
                "text-white",
              )}
              href="/sign-up"
            >
              Start free
            </Link>
          </ViewTransition>
        </div>
      </div>
    </header>
  );
}
