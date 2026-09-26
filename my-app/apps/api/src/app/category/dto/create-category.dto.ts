import { createCategorySchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class CreateCategoryDto extends createZodDto(createCategorySchema){}