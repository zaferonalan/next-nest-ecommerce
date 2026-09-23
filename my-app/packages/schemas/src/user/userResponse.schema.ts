import z from "zod";
import { roleSchema } from "../auth/role.schema.js";

export const userResponseSchema = z.object({
    id: z.string(),
    email: z.email(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    role: roleSchema,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()
})

export type UserResponseInput = z.infer<typeof userResponseSchema>