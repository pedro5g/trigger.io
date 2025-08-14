"use server";

import { createServerAction } from "zsa";
import { signUpSchema } from "./schema";
import { logger } from "@/lib/utils";
import { ApiSignUp } from "@/lib/api/endpoints/endpoints.server";

export const signUpAction = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    const [err, data] = await ApiSignUp(input);

    if (err) {
      logger.warn(err);
      throw err.response?.data.errorCode;
    }

    return data;
  });
