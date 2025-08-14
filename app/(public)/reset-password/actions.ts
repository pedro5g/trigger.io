"use server";

import { createServerAction } from "zsa";
import { resetPasswordSchema } from "./schema";
import { logger } from "@/lib/utils";
import { ApiResetPassword } from "@/lib/api/endpoints/endpoints.server";

export const resetPasswordAction = createServerAction()
  .input(resetPasswordSchema)
  .handler(async ({ input }) => {
    const [err, data] = await ApiResetPassword(input);

    if (err) {
      logger.warn(err);
      throw err.response?.data.errorCode;
    }

    return data;
  });
