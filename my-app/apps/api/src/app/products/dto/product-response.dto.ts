import { productResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class ProductResponseDto extends createZodDto(productResponseSchema){}