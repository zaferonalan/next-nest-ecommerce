import { authUserSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class AuthUserDto extends createZodDto(authUserSchema){}