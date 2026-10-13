import { queryOrderSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class QueryOrderDto extends createZodDto(queryOrderSchema){} 