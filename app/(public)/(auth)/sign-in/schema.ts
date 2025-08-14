import z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Hmm... that doesn't look like a valid email." }),
  password: z
    .string()
    .min(8, { message: "Your password must be at least 8 characters long." })
    .max(100, {
      message:
        "Password is too long — are you hiding a novel in there? Max 100 characters.",
    }),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
