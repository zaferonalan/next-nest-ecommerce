import { categoryListResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class CategoryListResponseDto extends createZodDto(categoryListResponseSchema){}