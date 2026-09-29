import z from "zod";
import { productResponseSchema } from "./product-response.dto.js";

export const productListResponseSchema = z.object({
    data: z.array(productResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPage: z.number()
    })
})

export type ProductListResponseType = z.infer<typeof productListResponseSchema>