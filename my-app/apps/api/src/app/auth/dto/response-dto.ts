import { responseSchema } from "@org/schemas";
import { createZodDto } from "nestjs-zod";

export class ResponseDto extends createZodDto(responseSchema){}