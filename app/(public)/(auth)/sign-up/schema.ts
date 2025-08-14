import z from "zod";

export const signUpSchema = z.object({
  name: z
    .string({
      message: "Who're you? Name is required.",
    })
    .trim()
    .min(3, {
      message: "Name must be at least 3 characters long.",
    })
    .max(255, {
      message: "Whoa, that name's a bit too log. Max 255 characters.",
    }),
  email: z
    .string({
      message: "Email is required.",
    })
    .email({ message: "That doesn't look like a valid email address." }),
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

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
