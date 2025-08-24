"use client";

import type { User } from "@/lib/api/endpoints/endpoints.types";
import { useUser } from "@/lib/auth/provider";
import { use } from "react";

type UserCurrentUserReturn = { isAuthenticated: boolean } & (
  | { isAuthenticated: true; user: User }
  | { isAuthenticated: false; user: null }
);

export function useCurrentUser(): UserCurrentUserReturn {
  const { userPromise } = useUser();
  const user = use(userPromise);

  return {
    isAuthenticated: !!user,
    user,
  } as UserCurrentUserReturn;
}
