import { queryProductSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class QueryProductDto extends createZodDto(queryProductSchema){}