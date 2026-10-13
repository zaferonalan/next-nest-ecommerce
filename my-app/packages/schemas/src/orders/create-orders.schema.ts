import z from "zod";
import { ordersItemSchema } from "./orders-item.schema.js";

export const createOrdersSchema = z.object({
    items: z.array(ordersItemSchema),
    shippingAdress: z.string().optional()
})

export type CreateOrdersType = z.infer<typeof createOrdersSchema>