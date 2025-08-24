import z from "zod";

export const createProjectSchema = z.object({
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
    .optional(),
  domain: z
    .string()
    .toLowerCase()
    .trim()
    .url({
      message: "That doesn’t look like a valid URL. Example: https://myapp.com",
    })
    .optional(),
  icon: z.string().trim().optional(),
});

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;
