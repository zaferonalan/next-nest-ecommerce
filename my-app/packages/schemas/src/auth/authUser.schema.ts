import z from "zod";
import { roleSchema } from "./role.schema.js";

export const authUserSchema = z.object({
    id: z.uuid(),
    email: z.email(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    role: roleSchema
})

export type AuthUser = z.infer<typeof authUserSchema>