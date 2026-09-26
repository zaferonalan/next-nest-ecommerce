import z from "zod";

export const categoryResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    slug: z.string().nullable(),
    imageUrl: z.url().nullable(),
    isActive: z.boolean(),
    productCount: z.number(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()

})

export type CategoryResponseType = z.infer<typeof categoryResponseSchema>