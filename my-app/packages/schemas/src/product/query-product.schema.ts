import z from "zod";

export const queryProductSchema = z.object({
    category: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    search: z.string().optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().min(1).max(10).optional()
})

export type QueryProductType = z.infer<typeof queryProductSchema>