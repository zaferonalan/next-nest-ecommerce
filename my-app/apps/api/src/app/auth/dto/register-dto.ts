import { createZodDto } from "nestjs-zod";
import { registerSchema } from "@org/schemas";

export class RegisterDto extends createZodDto(registerSchema){}