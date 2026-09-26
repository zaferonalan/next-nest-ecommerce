import { updateCategorySchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class UpdateCategoryDto extends createZodDto(updateCategorySchema){}