import z from "zod";

export const queryCategorySchema = z.object({
    isActive: z.boolean().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(10).optional()
})

export type QueryCategoryType = z.infer<typeof queryCategorySchema>