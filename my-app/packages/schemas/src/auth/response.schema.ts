import z from "zod";
import { roleSchema } from "./role.schema.js";

export const responseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        role: roleSchema
    }),
    accessToken: z.string(),
    refreshToken: z.string()
})

export type ResponseInput = z.infer<typeof responseSchema>