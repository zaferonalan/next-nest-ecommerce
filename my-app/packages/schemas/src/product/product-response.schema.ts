import z from "zod";

export const productResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    stock: z.number(),
    sku: z.string(),
    imageUrl: z.url().nullable(),
    category: z.string().nullable()
})

export type ProductResponseType = z.infer<typeof productResponseSchema>