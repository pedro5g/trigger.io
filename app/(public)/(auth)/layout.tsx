import { unstable_ViewTransition as ViewTransition } from "react";
import { Logo } from "@/app/_components/logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid lg:grid-cols-2">
      <div className="hidden flex-1 p-6 md:p-10 lg:flex">
        <div className="mb-30 flex flex-col items-center justify-center space-y-5">
          <Logo />
          <ViewTransition name="logo-name-transition">
            <h1 className="text-4xl font-extrabold">
              Welcome to Trigger<span className="text-blue-400">.io</span>
            </h1>
          </ViewTransition>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}
