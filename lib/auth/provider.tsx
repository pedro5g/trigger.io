"use client";

import { createContext, useContext } from "react";
import type { User } from "../api/endpoints/endpoints.types";

type UserContextType = {
  userPromise: Promise<User | null>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  userPromise,
  children,
}: {
  userPromise: Promise<User | null>;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ userPromise }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
