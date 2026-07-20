import z from "zod";

export const registerSchema = z.object({
    email: z.string().trim().min(1, {error: ""}).pipe(z.email({error: "Plese enter a valid email"}).trim().min(1, {error: "Email is required"})),
    password: z.string()
        .min(8, {error: "Password must be at least 8 chearacters long"})
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
    firstName: z.string().optional(),
    lastName: z.string().optional()
})

export type RegisterInput = z.infer<typeof registerSchema>


