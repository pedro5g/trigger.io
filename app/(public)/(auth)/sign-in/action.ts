"use server";
import { createServerAction } from "zsa";
import { signInSchema } from "./schema";
import { logger } from "@/lib/utils";
import { ApiSignIn } from "@/lib/api/endpoints/endpoints.server";
import { setSessionCookie } from "@/lib/auth/server";

export const signInAction = createServerAction()
  .input(signInSchema)
  .handler(async ({ input }) => {
    const [err, data] = await ApiSignIn(input);

    if (err) {
      logger.error(err);
      throw err.response?.data.errorCode as string;
    }

    await setSessionCookie({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresIn,
    });

    return {
      message: "Successfully",
    };
  });
