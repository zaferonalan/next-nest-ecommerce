import { updateProductSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class UpdateProductDto extends createZodDto(updateProductSchema){}