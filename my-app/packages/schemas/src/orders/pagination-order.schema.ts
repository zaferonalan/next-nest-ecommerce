import z from "zod";
import { apiResponseSchema } from "./api-response.schema.js";
import { orderResponseSchema } from "./order-response.schema.js";

export const paginationOrderSchema = apiResponseSchema(
    z.object({
        items: z.array(orderResponseSchema),
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        total: z.number().int().nonnegative(),
    })
)

export type PaginationOrderType = z.infer<typeof paginationOrderSchema>