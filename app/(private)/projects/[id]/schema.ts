import z from "zod";

export const editProjectSchema = z.object({
  projectId: z.string().trim().uuid(),
  projectName: z
    .string()
    .trim()
    .min(3, { message: "Project name must be at least 3 characters long." })
    .max(255, {
      message: "Whoa, that project name is too long. Max 255 characters.",
    }),
  description: z
    .string()
    .trim()
    .max(1000, {
      message: "Description is too long. Keep it under 1000 characters.",
    })
    .nullable(),
  domain: z
    .string()
    .toLowerCase()
    .trim()
    .url({
      message: "That doesn’t look like a valid URL. Example: https://myapp.com",
    })
    .nullable(),
  icon: z.string().trim().nullable(),
});

export type EditProjectSchemaType = z.infer<typeof editProjectSchema>;
