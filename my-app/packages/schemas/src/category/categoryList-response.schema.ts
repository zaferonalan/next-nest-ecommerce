import z from "zod";
import { categoryResponseSchema } from "./category-response.schema.js";

export const categoryListResponseSchema = z.object({
    data: z.array(categoryResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPage: z.number(),
    })
})

export type CategoryListResponseType = z.infer<typeof categoryListResponseSchema>