import z from "zod";

export const createPaymentSchema = z.object({
    orderId: z.string(),
    amount: z.number(),
    currency: z.string().optional().default('usd'),
    description: z.string().optional()
})

export type CreatePaymentType = z.infer<typeof createPaymentSchema>