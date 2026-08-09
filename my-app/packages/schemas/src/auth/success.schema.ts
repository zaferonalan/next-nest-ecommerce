import { z } from "zod";

export const successSchema = z.object({
    success: z.boolean()
})

export type SuccessAuth = z.infer<typeof successSchema>