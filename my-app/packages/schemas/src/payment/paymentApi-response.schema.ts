import z from "zod";
import { createPaymentSchema } from "./create-payment.schema.js";

export const createPaymentApiResponseSchema = z.object({
    success: z.boolean(),
    data: createPaymentSchema,
    message: z.string().nullable()
})

export type CreatePaymentApiResponseType = z.infer<typeof createPaymentApiResponseSchema>