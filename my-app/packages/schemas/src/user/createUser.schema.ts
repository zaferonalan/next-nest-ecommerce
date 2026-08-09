import z from "zod";
import { registerSchema } from "../auth/register.schema.js";


export const createUserSchema = registerSchema.extend({
    firstName: z.string().optional(),
    lastName: z.string().optional()
})

export type CreateUserInput = z.infer<typeof createUserSchema>
