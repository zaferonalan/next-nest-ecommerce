import z from "zod";
import { Role } from "@org/database";

export const responseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        role: z.enum(Role)
    }),
    accessToken: z.string(),
    refreshToken: z.string()
})

export type ResponseInput = z.infer<typeof responseSchema>