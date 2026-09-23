import { changePasswordSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class ChangePasswordDto extends createZodDto(changePasswordSchema){}