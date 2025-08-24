"use server";

import { createServerAction } from "zsa";
import { deleteProjectSchema } from "../schemas/delete-project.schema";
import { ApiDisableProject } from "@/lib/api/endpoints/endpoints.server";
import { logger } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export const deleteProjectAction = createServerAction()
  .input(deleteProjectSchema)
  .handler(async ({ input }) => {
    const [err, data] = await ApiDisableProject({ projectId: input.projectId });

    if (err) {
      logger.error(err);
      throw err.response?.data.errorCode as string;
    }

    revalidateTag("projects");

    return data;
  });
