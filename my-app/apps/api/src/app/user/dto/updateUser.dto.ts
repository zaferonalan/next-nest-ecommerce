import { updateUserSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class UpdateUserDto extends createZodDto(updateUserSchema){
}