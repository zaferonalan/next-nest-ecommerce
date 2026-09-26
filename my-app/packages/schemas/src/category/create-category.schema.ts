import z from "zod";

export const createCategorySchema = z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(255).optional(),
    slug: z.string().trim().min(1).max(100).optional(),
    imageUrl: z.url().trim().min(1).max(255).optional(),
    isActive: z.boolean().optional()
})

export type CreateCategoryType = z.infer<typeof createCategorySchema>