import { successSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class SuccessDto extends createZodDto(successSchema){}