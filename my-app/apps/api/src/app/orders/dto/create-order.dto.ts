import { createOrdersSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class CreateOrderDto extends createZodDto(createOrdersSchema){}