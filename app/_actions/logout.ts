"use server";

import { cookies } from "next/headers";
import { createServerAction } from "zsa";
import { redirect, RedirectType } from "next/navigation";

export const logoutAction = createServerAction().handler(async () => {
  const cookieStore = await cookies();
  cookieStore.delete("app_session_v1");
  cookieStore.delete("accessToken");

  redirect("/sign-in", RedirectType.replace);
});
