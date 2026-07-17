import z from "zod";

export const appSchema = z.object({
    PORT: z.coerce.number().int().min(1)
})