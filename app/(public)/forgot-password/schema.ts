import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Emails is required" })
    .email({ message: "But you don't even remember the email?" }),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
