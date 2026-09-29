import { productListResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class ProductListResponseDto extends createZodDto(productListResponseSchema){}