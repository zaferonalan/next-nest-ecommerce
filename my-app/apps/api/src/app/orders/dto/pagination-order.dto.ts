import { paginationOrderSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class PaginationOrderDto extends createZodDto(paginationOrderSchema){}