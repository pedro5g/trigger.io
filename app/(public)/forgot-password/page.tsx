import { ForgotPasswordForm } from "./_components/form";
import { unstable_ViewTransition as ViewTransition } from "react";

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
  }>;
}) {
  const { email } = await searchParams;

  return (
    <ViewTransition>
      <main className="flex h-full w-full max-w-3xl items-center justify-center">
        <ForgotPasswordForm email={email} />
      </main>
    </ViewTransition>
  );
}
