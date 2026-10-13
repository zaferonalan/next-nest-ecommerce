import z from "zod";
import { ordersItemSchema } from "./orders-item.schema.js";

export const orderResponseSchema = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    status: z.string(),
    total: z.number(),
    shippingAdress: z.string(),
    items: z.array(ordersItemSchema),
    userEmail: z.string().optional(),
    userName: z.string().optional(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()

})

export type OrderResponseType = z.infer<typeof orderResponseSchema>