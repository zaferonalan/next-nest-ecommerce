import { paymentResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class PaymentResponseDto extends createZodDto(paymentResponseSchema){}