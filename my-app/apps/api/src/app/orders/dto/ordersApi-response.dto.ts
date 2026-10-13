import { orderApiResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class OrderApiResponseDto extends createZodDto(orderApiResponseSchema){}