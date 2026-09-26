import { categoryResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class CategoryResponseDto extends createZodDto(categoryResponseSchema){}