import { Role } from "@org/database";
import z from "zod";

export const roleSchema = z.enum(Role)

export type RoleType = z.infer<typeof roleSchema>