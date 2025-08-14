import { SignUpForm } from "./_components/form";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function SignUp() {
  return (
    <ViewTransition>
      <main className="w-full max-w-sm">
        <SignUpForm />
      </main>
    </ViewTransition>
  );
}
