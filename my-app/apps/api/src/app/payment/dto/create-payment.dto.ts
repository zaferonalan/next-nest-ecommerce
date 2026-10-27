import { createPaymentSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class CreatePaymentDto extends createZodDto(createPaymentSchema){}