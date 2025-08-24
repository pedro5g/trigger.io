"use server";
import { ApiUpdateProject } from "@/lib/api/endpoints/endpoints.server";
import { logger } from "@/lib/utils";
import z from "zod";
import { createServerAction } from "zsa";

const changeProjectNameSchema = z.object({
  projectId: z.string().uuid(),
  projectName: z.string().trim().min(3).max(255),
});

export const changeProjectNameAction = createServerAction()
  .input(changeProjectNameSchema)
  .handler(async ({ input }) => {
    const [err, data] = await ApiUpdateProject({
      projectId: input.projectId,
      projectName: input.projectName,
    });

    if (err) {
      logger.error(err);
      throw "Invalid name";
    }

    return data;
  });
