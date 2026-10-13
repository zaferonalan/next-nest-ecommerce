import z from "zod";

export const ordersItemSchema = z.object({
    id: z.uuid(),
    productId: z.uuid(),
    productName: z.string(),
    quantity: z.number(),
    price: z.number(),
    subtotal: z.number(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()
})

export type OrdersItemType = z.infer<typeof ordersItemSchema>