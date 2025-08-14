import "server-only";
import {
  createSessionToken,
  parseSessionToken,
  type SessionData,
} from "./utils";
import { ApiUserProfile } from "../api/endpoints/endpoints.server";
import { cookies } from "next/headers";
import { cache } from "react";

const COOKIE_NAME = "app_session_v1";

export async function setSessionCookie(session: SessionData) {
  const cookieStore = await cookies();
  const token = await createSessionToken(session);

  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function refreshSession(
  refreshToken: string = "",
): Promise<SessionData | null> {
  const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return null;
  }

  const data = await response.json();
  const newSession: SessionData = {
    accessToken: data.accessToken,
    refreshToken: data.refreshSession ?? refreshToken,
    expiresAt: Date.now() + data.expiresIn * 1000,
  };

  await setSessionCookie(newSession);
  return newSession;
}

export async function getSessionFromCookie(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await parseSessionToken(token);
  if (!payload) return null;
  return payload as SessionData;
}

export async function getValidSession(): Promise<SessionData | null> {
  const session = await getSessionFromCookie();
  if (!session) return null;

  const now = Date.now();
  const margin = 20 * 1000;
  if (session.expiresAt - now <= margin) {
    const refreshed = await refreshSession(session.refreshToken);
    return refreshed;
  }

  return session;
}

export const getUser = cache(async () => {
  const [err, data] = await ApiUserProfile();
  if (err) return null;
  return data.user;
});
