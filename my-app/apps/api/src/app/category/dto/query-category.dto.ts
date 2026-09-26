import { queryCategorySchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class QueryCategoryDto extends createZodDto(queryCategorySchema){}