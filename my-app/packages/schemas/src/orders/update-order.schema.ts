import z from "zod";
import { orderStatusSchema } from "./order-Status.schema.js";

export const updateOrderSchema = z.object({
    status: orderStatusSchema.optional(),
    trackingNumber: z.string().optional(),
    notes: z.string().optional()
})

export type UpdateOrderType = z.infer<typeof updateOrderSchema>