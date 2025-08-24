import { z } from "zod";

export const deleteProjectSchema = z.object({
  projectId: z.string().trim().uuid(),
  confirmationText: z.literal("DELETE", { message: "Please type DELETE" }),
});

export type DeleteProjectSchemaType = z.infer<typeof deleteProjectSchema>;
