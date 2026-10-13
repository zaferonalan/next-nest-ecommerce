import z from "zod";
import { apiResponseSchema } from "./api-response.schema.js";
import { orderResponseSchema } from "./order-response.schema.js";


export const orderApiResponseSchema = apiResponseSchema(orderResponseSchema)

export type OrderApiResponseType = z.infer<typeof orderApiResponseSchema>