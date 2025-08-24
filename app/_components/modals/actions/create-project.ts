"use server";

import { createServerAction } from "zsa";
import { createProjectSchema } from "../schemas/create-project.schema";
import { ApiCreateProject } from "@/lib/api/endpoints/endpoints.server";
import { logger } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export const createProjectAction = createServerAction()
  .input(createProjectSchema)
  .handler(async ({ input }) => {
    const [err, data] = await ApiCreateProject(input);

    if (err) {
      logger.error(err);
      throw err.response?.data.errorCode as string;
    }

    revalidateTag("projects");

    return data;
  });
