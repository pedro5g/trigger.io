import z from "zod";

export const resetPasswordSchema = z.strictObject({
  token: z.string().regex(/^[A-Za-z0-9]{8}$/, {
    message:
      "Token must be exactly 8 characters long and contain only letters and numbers.",
  }),
  password: z
    .string({
      message: "Password is required.",
    })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, {
      message:
        "That's a strong password... maybe 'too' strong. Max 100 characters.",
    })
    .refine((pass) => {
      const checks = [
        /.{8,}/.test(pass),
        /[0-9]/.test(pass),
        /[a-z]/.test(pass),
        /[A-Z]/.test(pass),
        /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      ];
      const valid = checks.every(Boolean);
      return valid;
    }, "Password must be strong (8+ chars, number, upper, lowercase & symbol)"),
});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
