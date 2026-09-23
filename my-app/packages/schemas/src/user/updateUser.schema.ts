import z from "zod";

export const updateUserSchema = z.object({
    email: z.email(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional()
})

export type UpdateUser = z.infer<typeof updateUserSchema>