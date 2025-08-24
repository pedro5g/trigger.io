"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

export function RootProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
