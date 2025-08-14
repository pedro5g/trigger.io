"use server";

import { createServerAction } from "zsa";
import { forgotPasswordSchema } from "./schema";
import { logger } from "@/lib/utils";
import { ApiForgotPassword } from "@/lib/api/endpoints/endpoints.server";

export const forgotPasswordAction = createServerAction()
  .input(forgotPasswordSchema)
  .handler(async ({ input }) => {
    const [err, data] = await ApiForgotPassword(input);

    if (err) {
      logger.warn(err);
      throw err.response?.data.errorCode;
    }

    return data;
  });
