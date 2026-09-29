import z from "zod";

export const createProductSchema = z.object({
    name: z.string().max(200),
    description: z.string().nullable(),
    price: z.number().min(0),
    stock: z.number().int().min(0),
    sku: z.string().nonempty().max(50),
    imageUrl: z.url().nullable(),
    categoryId: z.string(),
    isActive: z.boolean().optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()
})


export type CreateProductType = z.infer<typeof createProductSchema>