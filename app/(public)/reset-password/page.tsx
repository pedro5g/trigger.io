import { ResetPasswordForm } from "./_components/form";
import { unstable_ViewTransition as ViewTransition } from "react";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    expires?: string;
    target?: string;
  }>;
}) {
  const { token, expires, target } = await searchParams;

  return (
    <ViewTransition>
      <main className="flex h-full w-full max-w-3xl items-center justify-center">
        <ResetPasswordForm token={token} expires={expires} email={target} />
      </main>
    </ViewTransition>
  );
}
