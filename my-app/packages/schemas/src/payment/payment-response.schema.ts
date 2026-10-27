import z from "zod";

export const paymentResponseSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    amount: z.number(),
    userId: z.string(),
    currency: z.string(),
    status: z.string(),
    paymentMethod: z.string().nullable(),
    transactionId: z.string().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()
})


export type PaymentResponseType = z.infer<typeof paymentResponseSchema>