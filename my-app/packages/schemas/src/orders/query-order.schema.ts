import z from "zod";
import { orderStatusSchema } from "./order-Status.schema.js";

export const queryOrderSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    total: z.coerce.number().int().nonnegative(),
    status: orderStatusSchema.optional(),
    search: z.string().trim().optional()
})

export type QueryOrderType = z.infer<typeof queryOrderSchema>