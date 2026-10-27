import z from "zod";

export const createPaymentApiResponseSchema = z.object({
    clientSecret: z.string(),
    paymentId: z.string()
})

export type CreatePaymentApiResponseType = z.infer<typeof createPaymentApiResponseSchema>