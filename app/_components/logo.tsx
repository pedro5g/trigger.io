import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps
  extends Omit<React.ComponentProps<typeof Image>, "src" | "alt"> {
  href?: string;
}

export function Logo({
  href = "/",
  width = 75,
  height = 75,
  className,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("flex flex-col items-center font-medium", className)}
    >
      <div className="flex items-center justify-center rounded-md">
        <ViewTransition name="logo-image-transition">
          <Image src="/icon.png" alt="logo" width={width} height={height} />
        </ViewTransition>
      </div>
      <span className="sr-only">Trigger.io</span>
    </Link>
  );
}
