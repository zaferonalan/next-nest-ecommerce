import { updateOrderSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class UpdateOrderDto extends createZodDto(updateOrderSchema){}