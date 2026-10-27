import { createPaymentApiResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class CreatePaymentApiResponseDto extends createZodDto(createPaymentApiResponseSchema){}