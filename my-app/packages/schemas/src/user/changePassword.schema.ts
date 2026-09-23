import z from "zod";

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, {error: "Password must be at least 8 chearacters long"})
        .max(64, {error: "Password must be at most 64 characters"})
        .regex(/[A-Z]/, {
            error: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            error: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, {
            error: "Password must contain at least one number.",
        })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
            error: "Password must contain at least one special character.",
        }),

})

export type ChangePasswordType = z.infer<typeof changePasswordSchema>