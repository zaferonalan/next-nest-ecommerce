import { updateProductStockSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class UpdateProductStockDto extends createZodDto(updateProductStockSchema){}