import { paymentApiResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class PaymentApiResponseDto extends createZodDto(paymentApiResponseSchema){}