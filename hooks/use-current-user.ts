"use client";

import { useUser } from "@/lib/auth/provider";
import { use } from "react";

export function useCurrentUser() {
  const { userPromise } = useUser();
  const user = use(userPromise);

  return {
    user,
    isAuthenticated: !!user,
  };
}
