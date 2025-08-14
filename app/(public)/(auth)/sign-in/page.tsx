import { SignInForm } from "./_components/form";
import { unstable_ViewTransition as ViewTransition } from "react";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
  }>;
}) {
  const { email } = await searchParams;

  return (
    <ViewTransition>
      <main className="w-fill max-w-sm">
        <SignInForm email={email} />
      </main>
    </ViewTransition>
  );
}
