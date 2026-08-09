import { loginUserSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class LoginDto extends createZodDto(loginUserSchema){}