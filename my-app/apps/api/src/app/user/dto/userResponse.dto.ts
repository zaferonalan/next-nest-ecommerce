import { userResponseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class UserResponseDto extends createZodDto(userResponseSchema){}