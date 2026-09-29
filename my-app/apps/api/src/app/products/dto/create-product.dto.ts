import { createProductSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class CreateProductDto extends createZodDto(createProductSchema){}